"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadForm from "./components/UploadForm";
import ResultPanel from "./components/ResultPanel";
import { 
  ChartBarIcon, 
  CalculatorIcon, 
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlayIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";
import CashFlowAnalysis from "./components/CashFlowAnalysis";
import PortfolioManager from "./components/PortfolioManager";
import AdvancedAnalytics from "./components/AdvancedAnalytics";

interface AnalysisResult {
  type: 'auto-mapped' | 'manual-mapping';
  data: unknown[][];
  headers?: string[];
  suggestions?: Record<string, string>;
  fileName?: string;
}

type TabType = 'upload' | 'analysis' | 'cash-flow' | 'portfolio' | 'advanced' | 'reports';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [companyName, setCompanyName] = useState<string>("");

  const tabs = [
    {
      id: 'upload' as const,
      label: 'Upload & Analysis',
      icon: DocumentArrowUpIcon,
      color: 'from-blue-500 to-blue-600',
      description: 'Upload financial statements and get instant analysis'
    },
    {
      id: 'cash-flow' as const,
      label: 'Cash Flow',
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-green-600',
      description: 'Detailed cash flow analysis and forecasting'
    },
    {
      id: 'portfolio' as const,
      label: 'Portfolio',
      icon: BuildingOfficeIcon,
      color: 'from-purple-500 to-purple-600',
      description: 'Multi-company portfolio management and benchmarking'
    },
    {
      id: 'advanced' as const,
      label: 'Advanced Analytics',
      icon: BeakerIcon,
      color: 'from-orange-500 to-orange-600',
      description: 'Monte Carlo simulations and scenario modeling'
    },
    {
      id: 'reports' as const,
      label: 'Reports',
      icon: DocumentTextIcon,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Export professional financial reports and presentations'
    }
  ];

  const handleAnalysisComplete = (data: any, name?: string) => {
    setAnalysisData(data);
    if (name) setCompanyName(name);
    setActiveTab('analysis');
  };

  const features = [
    {
      icon: ChartBarIcon,
      title: "Smart Analysis",
      description: "20+ financial ratios with automated insights and red-flag detection",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: CalculatorIcon,
      title: "DuPont Breakdown",
      description: "ROE decomposition to understand performance drivers",
      color: "from-green-500 to-green-600"
    },
    {
      icon: DocumentChartBarIcon,
      title: "Professional Reports",
      description: "Export beautiful PDF reports with charts and analysis",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Valuation Models",
      description: "DCF analysis and comparable company valuations",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: ArrowTrendingUpIcon,
      title: "Forecasting",
      description: "12-month projections with scenario analysis",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: ShieldCheckIcon,
      title: "Industry Benchmarks",
      description: "Compare against 8+ industry peer groups",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { label: "Analysis Time", value: "<60s", icon: SparklesIcon },
    { label: "Financial Ratios", value: "20+", icon: CalculatorIcon },
    { label: "Industry Benchmarks", value: "8+", icon: ChartBarIcon },
    { label: "Report Formats", value: "PDF", icon: DocumentChartBarIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                <ChartBarIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinDash
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Professional Financial Analysis Platform
              </p>
            </div>
          </div>
          
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your Excel/CSV financial statements into comprehensive dashboards and FP&A outputs in under 60 seconds. 
            From single company analysis to portfolio management with advanced modeling capabilities.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
            {[
              {
                icon: SparklesIcon,
                title: "AI-Powered Analysis",
                description: "Automated ratio calculation, DuPont analysis, and intelligent insights"
              },
              {
                icon: ArrowTrendingUpIcon,
                title: "Portfolio Management",
                description: "Multi-company analysis, benchmarking, and risk assessment"
              },
              {
                icon: CpuChipIcon,
                title: "Advanced Modeling",
                description: "Monte Carlo simulations, sensitivity analysis, and scenario planning"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg w-fit mb-4 mx-auto">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color.split(' ')[1]}/25`
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-400 hover:bg-white/90 dark:hover:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3 px-6 py-4">
                <tab.icon className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className={`text-xs transition-colors ${
                    activeTab === tab.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[600px]"
          >
            {activeTab === 'upload' && (
              <div className="space-y-8">
                <UploadForm onResult={handleAnalysisComplete} />
                {analysisData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ResultPanel results={analysisData} />
                  </motion.div>
                )}
              </div>
            )}
            
            {activeTab === 'analysis' && analysisData && (
              <ResultPanel results={analysisData} />
            )}
            
            {activeTab === 'cash-flow' && (
              <CashFlowAnalysis 
                data={analysisData?.rawData || {}} 
                periods={analysisData?.periods || ['Period 1', 'Period 2', 'Period 3']} 
              />
            )}
            
            {activeTab === 'portfolio' && (
              <PortfolioManager />
            )}
            
            {activeTab === 'advanced' && (
              <AdvancedAnalytics 
                financialData={analysisData?.rawData} 
                companyName={companyName || "Sample Company"} 
              />
            )}
            
            {activeTab === 'reports' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <DocumentTextIcon className="h-24 w-24 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Professional Reports
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                  Export comprehensive financial reports, executive summaries, and investor presentations. 
                  This feature will be available in the next update.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl text-gray-600 dark:text-gray-400 font-medium">
                  <CpuChipIcon className="h-5 w-5" />
                  Coming Soon
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center py-8 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS. Powered by AI-driven financial analysis.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
