"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  DocumentArrowDownIcon,
  CheckIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  UserGroupIcon,
  NewspaperIcon
} from "@heroicons/react/24/outline";
import { FinancialMetrics } from "../utils/financialAnalysis";
import { exportFinancialReport, PDFExportOptions } from "../utils/pdfExport";
import { PeerComparisonResult } from "../utils/industryBenchmarks";

interface PDFExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  financialMetrics: FinancialMetrics;
  fileName: string;
  peerComparisonData?: PeerComparisonResult;
}

interface ExportOptions {
  companyName: string;
  reportTitle: string;
  sections: {
    executive: boolean;
    ratios: boolean;
    dupont: boolean;
    charts: boolean;
    forecasting: boolean;
    peerComparison: boolean;
  };
}

export default function PDFExportDialog({ 
  isOpen, 
  onClose, 
  financialMetrics, 
  fileName,
  peerComparisonData
}: PDFExportDialogProps) {
  const [options, setOptions] = useState<ExportOptions>({
    companyName: fileName || 'Company Analysis',
    reportTitle: 'Financial Analysis Report',
    sections: {
      executive: true,
      ratios: true,
      dupont: true,
      charts: true,
      forecasting: true,
      peerComparison: !!peerComparisonData
    }
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportOptions = {
        ...options,
        peerComparisonData: peerComparisonData
      };
      await exportFinancialReport(financialMetrics, fileName, exportOptions);
      setExportComplete(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = (key: keyof ExportOptions, value: string | boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section: keyof ExportOptions['sections']) => {
    setOptions(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  const sectionOptions = [
    {
      key: 'executive' as const,
      title: 'Executive Summary',
      description: 'High-level overview and key financial insights',
      icon: NewspaperIcon,
      enabled: options.sections.executive
    },
    {
      key: 'ratios' as const,
      title: 'Ratio Analysis',
      description: 'Comprehensive financial ratio breakdown and trends',
      icon: ScaleIcon,
      enabled: options.sections.ratios
    },
    {
      key: 'dupont' as const,
      title: 'DuPont Analysis',
      description: 'ROE decomposition and performance drivers',
      icon: ArrowTrendingUpIcon,
      enabled: options.sections.dupont
    },
    {
      key: 'charts' as const,
      title: 'Charts & Visualizations',
      description: 'Interactive charts and visual data representations',
      icon: ChartBarIcon,
      enabled: options.sections.charts
    },
    {
      key: 'forecasting' as const,
      title: 'Financial Projections',
      description: 'Forward-looking analysis and forecasting insights',
      icon: ArrowPathIcon,
      enabled: options.sections.forecasting
    },
    ...(peerComparisonData ? [{
      key: 'peerComparison' as const,
      title: 'Industry Peer Comparison',
      description: 'Performance benchmarking against industry standards',
      icon: UserGroupIcon,
      enabled: options.sections.peerComparison
    }] : [])
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <DocumentArrowDownIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Export PDF Report
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your financial analysis report
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BuildingOfficeIcon className="h-5 w-5" />
                Report Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={options.companyName}
                    onChange={(e) => updateOption('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={options.reportTitle}
                    onChange={(e) => updateOption('reportTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter report title"
                  />
                </div>
              </div>
            </div>

            {/* Section Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Include Sections
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectionOptions.map((section) => (
                  <motion.div
                    key={section.key}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      section.enabled
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        section.enabled ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <section.icon className={`h-5 w-5 ${
                          section.enabled ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {section.title}
                          </h4>
                          {section.enabled && (
                            <CheckIcon className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Export Summary */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Summary</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Company: {options.companyName}</p>
                <p>• Report: {options.reportTitle}</p>
                <p>• Sections: {sectionOptions.filter(s => options.sections[s.key]).length} of {sectionOptions.length} included</p>
                <p>• File name: {fileName}-financial-report.pdf</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            <motion.button
              onClick={handleExport}
              disabled={isExporting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                exportComplete
                  ? 'bg-green-600 text-white'
                  : isExporting
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {exportComplete ? (
                <>
                  <CheckIcon className="h-5 w-5" />
                  Report Generated!
                </>
              ) : isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Generate Report
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 