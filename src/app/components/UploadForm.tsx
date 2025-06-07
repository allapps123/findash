"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudArrowUpIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";

interface UploadFormProps {
  onResult?: (data: ParsedData | { type: 'auto-mapped' | 'manual-mapping'; [key: string]: unknown }) => void;
}

interface ParsedData {
  fileName: string;
  headers: string[];
  data: unknown[][];
  autoMapped: boolean;
  suggestions: Record<string, string>;
}

export default function UploadForm({ onResult }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [progress, setProgress] = useState(0);

  // Define financial statement line items for auto-mapping
  const FINANCIAL_KEYS = {
    'Revenue': ['revenue', 'net revenue', 'total revenue', 'sales', 'net sales', 'doanh thu', 'doanh thu thuần'],
    'COGS': ['cogs', 'cost of goods sold', 'cost of sales', 'giá vốn', 'giá vốn hàng bán'],
    'Gross Profit': ['gross profit', 'gross margin', 'lợi nhuận gộp'],
    'SG&A': ['sg&a', 'sga', 'selling general administrative', 'chi phí bán hàng', 'chi phí quản lý'],
    'EBITDA': ['ebitda', 'earnings before interest tax depreciation amortization'],
    'Net Income': ['net income', 'net profit', 'lợi nhuận sau thuế', 'lợi nhuận ròng'],
    'Total Assets': ['total assets', 'tổng tài sản'],
    'Total Liabilities': ['total liabilities', 'total debt', 'tổng nợ phải trả'],
    'Shareholders Equity': ['shareholders equity', 'equity', 'vốn chủ sở hữu'],
    'Cash Flow from Operations': ['operating cash flow', 'cfo', 'cash flow operations', 'dòng tiền hoạt động kinh doanh']
  };

  const validateFile = (file: File): boolean => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return false;
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
    ];
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      setError("Please upload Excel (.xlsx, .xls) or CSV files only");
      return false;
    }

    setError("");
    return true;
  };

  const autoMapHeaders = (headers: string[]): Record<string, string> => {
    console.log("Starting auto-mapping for headers:", headers);
    const mapping: Record<string, string> = {};
    
    headers.forEach(header => {
      const normalizedHeader = header.toLowerCase().trim();
      console.log("Processing header:", header, "normalized:", normalizedHeader);
      
      for (const [key, variants] of Object.entries(FINANCIAL_KEYS)) {
        for (const variant of variants) {
          const normalizedVariant = variant.toLowerCase();
          if (normalizedHeader.includes(normalizedVariant) || 
              normalizedVariant.includes(normalizedHeader) ||
              normalizedHeader === normalizedVariant) {
            if (!mapping[key]) { // Only map if not already mapped
              mapping[key] = header;
              console.log(`Mapped "${header}" to "${key}"`);
              break;
            }
          }
        }
        if (mapping[key]) break; // Stop looking for this key once found
      }
    });
    
    console.log("Final auto-mapping result:", mapping);
    return mapping;
  };

  const simulateProgress = () => {
    const steps = [
      { message: "Parsing file structure...", progress: 20 },
      { message: "Extracting financial data...", progress: 40 },
      { message: "Auto-mapping columns...", progress: 60 },
      { message: "Validating data integrity...", progress: 80 },
      { message: "Finalizing analysis...", progress: 100 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setProcessingStep(step.message);
        setProgress(step.progress);
      }, index * 800);
    });
  };

  const parseFile = async (file: File): Promise<ParsedData> => {
    simulateProgress();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log("Starting file parsing...", file.name);
          let workbook: XLSX.WorkBook;
          
          if (file.name.toLowerCase().endsWith('.csv')) {
            const text = e.target?.result as string;
            console.log("Parsing CSV file, first 200 chars:", text.substring(0, 200));
            workbook = XLSX.read(text, { type: 'string' });
          } else {
            const data = e.target?.result as ArrayBuffer;
            console.log("Parsing Excel file, buffer size:", data.byteLength);
            workbook = XLSX.read(data, { type: 'array' });
          }
          
          // Get first worksheet
          const sheetName = workbook.SheetNames[0];
          console.log("Found worksheet:", sheetName);
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log("Parsed JSON data rows:", jsonData.length);
          console.log("First few rows:", jsonData.slice(0, 3));
          
          if (jsonData.length === 0) {
            reject(new Error("File appears to be empty"));
            return;
          }
          
          const headers = jsonData[0] as string[];
          const dataRows = jsonData.slice(1) as unknown[][];
          
          console.log("Headers found:", headers);
          console.log("Data rows:", dataRows.length);
          
          // Auto-map headers
          const suggestions = autoMapHeaders(headers);
          console.log("Auto-mapping suggestions:", suggestions);
          const autoMapped = Object.keys(suggestions).length >= 3; // Need at least 3 mappings
          console.log("Auto-mapped:", autoMapped, "with", Object.keys(suggestions).length, "mappings");
          
          setTimeout(() => {
            const result = {
              fileName: file.name,
              headers,
              data: dataRows,
              autoMapped,
              suggestions
            };
            console.log("Final parsed result:", result);
            resolve(result);
          }, 1000);
          
        } catch (parseError) {
          console.error("Parse error:", parseError);
          reject(new Error("Failed to parse file. Please check the file format."));
        }
      };
      
      reader.onerror = () => {
        console.error("File reader error");
        reject(new Error("Failed to read file"));
      };
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!validateFile(file)) return;
    
    setFileName(file.name);
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!validateFile(file)) return;
    
    setFileName(file.name);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
    
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setUploading(true);
    setMessage("");
    setError("");
    setProgress(0);
    setProcessingStep("Initializing...");
    
    try {
      const parsedData = await parseFile(file);
      console.log("processFile - received parsed data:", parsedData);
      
      if (parsedData.autoMapped) {
        setMessage("File processed successfully! Auto-mapping detected.");
        const resultData = {
          type: 'auto-mapped' as const,
          ...parsedData
        };
        console.log("Calling onResult with auto-mapped data:", resultData);
        onResult?.(resultData);
      } else {
        setMessage("File uploaded. Manual mapping required.");
        const resultData = {
          type: 'manual-mapping' as const,
          ...parsedData
        };
        console.log("Calling onResult with manual-mapping data:", resultData);
        onResult?.(resultData);
      }
    } catch (error) {
      console.error("processFile error:", error);
      setError(error instanceof Error ? error.message : "An error occurred while processing the file");
      setMessage("");
    } finally {
      setUploading(false);
      setProgress(0);
      setProcessingStep("");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const downloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sample-financial-data.csv';
    link.download = 'sample-financial-data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Upload Area */}
      <motion.div
        className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-105'
            : uploading
            ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20'
            : error
            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: dragActive ? 1.05 : 1.02 }}
        layout
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 transform rotate-12 scale-110"></div>
        </div>

        {/* Floating Animation Elements */}
        {dragActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 left-10 w-8 h-8 bg-blue-500 rounded-lg opacity-40"
            />
            <motion.div
              animate={{
                y: [0, 15, 0],
                x: [0, -5, 0],
                rotate: [0, -3, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 right-16 w-6 h-6 bg-purple-500 rounded-full opacity-40"
            />
          </div>
        )}
        
        <div className="relative p-12 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-6"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 mx-auto mb-6"
                  >
                    <div className="w-full h-full rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"></div>
                  </motion.div>
                  <CpuChipIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Processing Your Financial Data
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  
                  <motion.p
                    key={processingStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-600 dark:text-gray-400 font-medium"
                  >
                    {processingStep}
                  </motion.p>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {progress}% Complete
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <motion.div
                  animate={dragActive ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center ${
                    dragActive
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/30'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600'
                  }`}
                >
                  {dragActive ? (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <CloudArrowUpIcon className="h-12 w-12 text-white" />
                    </motion.div>
                  ) : (
                    <DocumentIcon className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                  )}
                </motion.div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dragActive ? 'Drop your file here!' : 'Upload Financial Statement'}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {dragActive 
                      ? 'Release to start processing your financial data'
                      : 'Drag & drop your Excel or CSV file, or click to browse'
                    }
                  </p>
                  
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <CloudArrowUpIcon className="h-6 w-6" />
                    Choose File
                  </motion.button>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Excel (.xlsx, .xls)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>CSV files</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Max 10MB</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Sample Download */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Need a sample template?
            </h4>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Download our sample financial data to test FinDash's capabilities
          </p>
          
          <motion.button
            onClick={downloadSample}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download Sample Data
          </motion.button>
        </div>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        {(message || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-6"
          >
            <div className={`rounded-2xl p-6 border ${
              error 
                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
            }`}>
              <div className="flex items-center gap-3">
                {error ? (
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                ) : (
                  <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    error 
                      ? 'text-red-800 dark:text-red-200' 
                      : 'text-green-800 dark:text-green-200'
                  }`}>
                    {error || message}
                  </p>
                  {fileName && !error && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      File: {fileName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
