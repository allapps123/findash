"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  ScaleIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CpuChipIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area
} from "recharts";
import { 
  PortfolioAnalyzer, 
  CompanyData, 
  PortfolioMetrics,
  BenchmarkingResult,
  TrendAnalysis,
  createSamplePortfolio
} from "../utils/portfolioAnalysis";

interface PortfolioManagerProps {
  onAddCompany?: () => void;
}

interface CompanyUpload {
  id: string;
  name: string;
  industry: string;
  file?: File;
  data?: unknown[][];
  status: 'pending' | 'uploaded' | 'analyzed' | 'error';
  error?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const INDUSTRY_OPTIONS = [
  'Technology', 'Healthcare', 'Financial Services', 'Consumer Goods', 
  'Energy', 'Manufacturing', 'Real Estate', 'Telecommunications',
  'Retail', 'Transportation', 'Materials', 'Utilities'
];

export default function PortfolioManager({ onAddCompany }: PortfolioManagerProps) {
  const [companies, setCompanies] = useState<CompanyUpload[]>([]);
  const [portfolioData, setPortfolioData] = useState<CompanyData[]>([]);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [benchmarkingResults, setBenchmarkingResults] = useState<BenchmarkingResult[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'overview' | 'comparison' | 'trends'>('upload');
  const [selectedMetric, setSelectedMetric] = useState<string>('roe');
  const [showDemo, setShowDemo] = useState(false);

  const addCompany = useCallback(() => {
    const newCompany: CompanyUpload = {
      id: `company-${Date.now()}`,
      name: '',
      industry: 'Technology',
      status: 'pending'
    };
    setCompanies(prev => [...prev, newCompany]);
  }, []);

  const removeCompany = useCallback((id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  }, []);

  const updateCompany = useCallback((id: string, updates: Partial<CompanyUpload>) => {
    setCompanies(prev => prev.map(company => 
      company.id === id ? { ...company, ...updates } : company
    ));
  }, []);

  const handleFileUpload = useCallback((id: string, file: File) => {
    updateCompany(id, { file, status: 'uploaded' });
    
    // Simulate file processing
    setTimeout(() => {
      // Mock processed data - in real implementation, this would parse the Excel/CSV file
      const mockData = generateMockFinancialData();
      updateCompany(id, { data: mockData, status: 'analyzed' });
    }, 1500);
  }, [updateCompany]);

  const analyzePortfolio = useCallback(() => {
    // Convert uploaded companies to CompanyData format
    const companyData: CompanyData[] = companies
      .filter(company => company.status === 'analyzed' && company.data)
      .map(company => ({
        id: company.id,
        name: company.name || `Company ${company.id.split('-')[1]}`,
        industry: company.industry,
        marketCap: Math.random() * 10000000000, // Mock market cap
        financialData: convertToFinancialData(company.data!),
        lastUpdated: new Date()
      }));

    if (companyData.length === 0) return;

    setPortfolioData(companyData);
    
    const analyzer = new PortfolioAnalyzer(companyData);
    const metrics = analyzer.analyzePortfolio();
    const benchmarking = analyzer.benchmarkCompanies();
    const trends = analyzer.analyzeTrends(['roe', 'roa', 'netMargin', 'debtToEquity']);

    setPortfolioMetrics(metrics);
    setBenchmarkingResults(benchmarking);
    setTrendAnalysis(trends);
    setActiveTab('overview');
  }, [companies]);

  const loadDemoData = useCallback(() => {
    const demoCompanies = createSamplePortfolio();
    setPortfolioData(demoCompanies);
    
    const analyzer = new PortfolioAnalyzer(demoCompanies);
    const metrics = analyzer.analyzePortfolio();
    const benchmarking = analyzer.benchmarkCompanies();
    const trends = analyzer.analyzeTrends(['roe', 'roa', 'netMargin', 'debtToEquity']);

    setPortfolioMetrics(metrics);
    setBenchmarkingResults(benchmarking);
    setTrendAnalysis(trends);
    setShowDemo(true);
    setActiveTab('overview');
  }, []);

  // Helper functions
  const generateMockFinancialData = () => {
    const periods = 3;
    return Array.from({ length: periods + 1 }, (_, i) => {
      if (i === 0) {
        return ['Revenue', 'Net Income', 'Total Assets', 'Total Liabilities', 'Shareholders Equity'];
      }
      return [
        100000000 + Math.random() * 50000000, // Revenue
        10000000 + Math.random() * 15000000,  // Net Income
        80000000 + Math.random() * 40000000,  // Total Assets
        30000000 + Math.random() * 20000000,  // Total Liabilities
        50000000 + Math.random() * 20000000   // Shareholders Equity
      ];
    });
  };

  const convertToFinancialData = (data: unknown[][]): Record<string, number[]> => {
    const headers = data[0] as string[];
    const result: Record<string, number[]> = {};
    
    headers.forEach((header, index) => {
      result[header] = data.slice(1).map(row => (row as number[])[index] || 0);
    });
    
    return result;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getStatusIcon = (status: CompanyUpload['status']) => {
    switch (status) {
      case 'pending': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'uploaded': return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'analyzed': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const tabConfig = [
    {
      id: 'upload' as const,
      label: 'Company Upload',
      icon: PlusIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'overview' as const,
      label: 'Portfolio Overview',
      icon: ChartBarIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'comparison' as const,
      label: 'Company Comparison',
      icon: ScaleIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'trends' as const,
      label: 'Trend Analysis',
      icon: ArrowTrendingUpIcon,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  // Prepare chart data
  const industryData = portfolioMetrics ? Object.entries(portfolioMetrics.industryBreakdown).map(([industry, data]) => ({
    name: industry,
    value: data.count,
    weightedValue: data.weightedValue
  })) : [];

  const performanceData = benchmarkingResults.map(result => ({
    company: result.company,
    overallRank: result.overallRank,
    roe: result.metrics.roe?.value || 0,
    roa: result.metrics.roa?.value || 0,
    netMargin: result.metrics.netMargin?.value || 0
  }));

  const correlationData = portfolioMetrics ? Object.entries(portfolioMetrics.correlationMatrix).map(([company1, correlations]) => ({
    company: company1,
    ...correlations
  })) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Portfolio Manager
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Upload multiple companies for comprehensive portfolio analysis and benchmarking
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <motion.button
            onClick={loadDemoData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg"
          >
            <CpuChipIcon className="h-5 w-5" />
            Load Demo Portfolio
          </motion.button>
        </div>
      </div>

      {/* Demo Banner */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center gap-3">
            <CpuChipIcon className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Demo Portfolio Loaded</h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Showing analysis for 5 sample companies across different industries. Upload your own data to replace this demo.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        {tabConfig.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' && (
            <div className="space-y-8">
              {/* Upload Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Company Upload Manager
                  </h3>
                  <motion.button
                    onClick={addCompany}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-md"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Add Company
                  </motion.button>
                </div>

                {/* Company List */}
                <div className="space-y-4">
                  {companies.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-3" />
                      <p>No companies added yet</p>
                      <p className="text-sm">Click "Add Company" to start building your portfolio</p>
                    </div>
                  ) : (
                    companies.map((company) => (
                      <motion.div
                        key={company.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Status Icon */}
                          <div className="md:col-span-1 flex justify-center">
                            {getStatusIcon(company.status)}
                          </div>

                          {/* Company Name */}
                          <div className="md:col-span-3">
                            <input
                              type="text"
                              placeholder="Company Name"
                              value={company.name}
                              onChange={(e) => updateCompany(company.id, { name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>

                          {/* Industry */}
                          <div className="md:col-span-3">
                            <select
                              value={company.industry}
                              onChange={(e) => updateCompany(company.id, { industry: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                              {INDUSTRY_OPTIONS.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                              ))}
                            </select>
                          </div>

                          {/* File Upload */}
                          <div className="md:col-span-4">
                            <input
                              type="file"
                              accept=".xlsx,.xls,.csv"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(company.id, file);
                              }}
                              className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>

                          {/* Remove Button */}
                          <div className="md:col-span-1 flex justify-center">
                            <motion.button
                              onClick={() => removeCompany(company.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Status Message */}
                        {company.status === 'uploaded' && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            Processing financial data...
                          </div>
                        )}

                        {company.error && (
                          <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                            Error: {company.error}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Analyze Button */}
                {companies.filter(c => c.status === 'analyzed').length > 1 && (
                  <div className="mt-6 text-center">
                    <motion.button
                      onClick={analyzePortfolio}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg"
                    >
                      <ChartBarIcon className="h-5 w-5 inline mr-2" />
                      Analyze Portfolio ({companies.filter(c => c.status === 'analyzed').length} companies)
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'overview' && portfolioMetrics && (
            <div className="space-y-8">
              {/* Portfolio Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Portfolio Companies",
                    value: portfolioData.length,
                    format: (v: number) => v.toString(),
                    icon: BuildingOfficeIcon,
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    label: "Avg ROE",
                    value: portfolioMetrics.weightedAverageROE,
                    format: formatPercent,
                    icon: ArrowTrendingUpIcon,
                    color: "from-green-500 to-green-600"
                  },
                  {
                    label: "Portfolio Risk",
                    value: portfolioMetrics.portfolioVolatility,
                    format: formatPercent,
                    icon: ExclamationTriangleIcon,
                    color: "from-orange-500 to-orange-600"
                  },
                  {
                    label: "Diversification",
                    value: portfolioMetrics.diversificationRatio,
                    format: (v: number) => `${v.toFixed(2)}x`,
                    icon: ScaleIcon,
                    color: "from-purple-500 to-purple-600"
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color}`}>
                        <metric.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {metric.format(metric.value)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Industry Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Industry Distribution
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {industryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Top Performers
                  </h3>
                  <div className="space-y-4">
                    {portfolioMetrics.topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {performer.company}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {performer.metric}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            #{performer.rank}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPercent(performer.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Comparison */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Company Performance Comparison
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="company" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="roe" fill="#3B82F6" name="ROE %" />
                      <Bar dataKey="roa" fill="#10B981" name="ROA %" />
                      <Bar dataKey="netMargin" fill="#F59E0B" name="Net Margin %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && benchmarkingResults.length > 0 && (
            <div className="space-y-8">
              {/* Benchmarking Results */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Company Benchmarking Results
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Company</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Overall Rank</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">ROE</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">ROA</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Net Margin</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Strengths</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarkingResults.map((result, index) => (
                        <tr key={result.company} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                            {result.company}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              result.overallRank <= 2 ? 'bg-green-100 text-green-800' :
                              result.overallRank <= 4 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              #{result.overallRank}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                            {formatPercent(result.metrics.roe?.value || 0)}
                          </td>
                          <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                            {formatPercent(result.metrics.roa?.value || 0)}
                          </td>
                          <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                            {formatPercent(result.metrics.netMargin?.value || 0)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {result.strengthAreas.slice(0, 2).map((strength, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && trendAnalysis.length > 0 && (
            <div className="space-y-8">
              {/* Metric Selection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Trend Analysis
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['roe', 'roa', 'netMargin', 'debtToEquity'].map((metric) => (
                    <motion.button
                      key={metric}
                      onClick={() => setSelectedMetric(metric)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedMetric === metric
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {metric.toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Trend Chart */}
              {trendAnalysis.find(t => t.metric === selectedMetric) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {selectedMetric.toUpperCase()} Trend Analysis
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Array.from({ length: 3 }, (_, i) => {
                        const trend = trendAnalysis.find(t => t.metric === selectedMetric);
                        const data: any = { period: `Period ${i + 1}` };
                        
                        Object.entries(trend?.companies || {}).forEach(([company, companyData]) => {
                          data[company] = companyData.values[i] || 0;
                        });
                        
                        return data;
                      })}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="period" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip />
                        <Legend />
                        {portfolioData.map((company, index) => (
                          <Line
                            key={company.name}
                            type="monotone"
                            dataKey={company.name}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={3}
                            dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 