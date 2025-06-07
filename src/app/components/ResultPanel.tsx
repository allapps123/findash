"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import MappingDialog from "./MappingDialog";
import PDFExportDialog from "./PDFExportDialog";
import PeerComparisonDialog from "./PeerComparisonDialog";
import ValuationDialog from "./ValuationDialog";
import CashFlowAnalysis from "./CashFlowAnalysis";
import { FinancialAnalyzer, FinancialMetrics, generateQuickForecast } from "../utils/financialAnalysis";
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  InformationCircleIcon,
  DocumentArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ArrowPathIcon,
  UserGroupIcon,
  CalculatorIcon
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';

interface ResultPanelProps {
  results: {
    type: 'auto-mapped' | 'manual-mapping';
    data: unknown[][];
    headers?: string[];
    suggestions?: Record<string, string>;
    fileName?: string;
  } | null;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export default function ResultPanel({ results }: ResultPanelProps) {
  const [showMapping, setShowMapping] = useState(false);
  const [showPDFDialog, setShowPDFDialog] = useState(false);
  const [showPeerComparison, setShowPeerComparison] = useState(false);
  const [showValuation, setShowValuation] = useState(false);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'ratios' | 'dupont' | 'cashflow' | 'forecast'>('overview');
  const [forecastAssumptions, setForecastAssumptions] = useState({
    revenueGrowth: 10,
    marginAssumption: 'maintain' as 'maintain' | 'improve' | 'decline',
    capexGrowth: 5
  });
  const [forecastData, setForecastData] = useState<ReturnType<typeof generateQuickForecast> | null>(null);

  const handleMapping = useCallback(async (mapping: Record<string, string>) => {
    if (!results) return;
    
    setShowMapping(false);
    setLoading(true);
    
    try {
      const analyzer = new FinancialAnalyzer(mapping, results.data as unknown[][]);
      const metrics = analyzer.analyze();
      setFinancialMetrics(metrics);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }, [results]);

  const updateForecast = useCallback(() => {
    if (!financialMetrics) return;
    
    const forecast = generateQuickForecast(financialMetrics, forecastAssumptions);
    setForecastData(forecast);
  }, [financialMetrics, forecastAssumptions]);

  useEffect(() => {
    if (results) {
      if (results.type === 'manual-mapping') {
        setShowMapping(true);
      } else if (results.type === 'auto-mapped') {
        handleMapping(results.suggestions || {});
      }
    }
  }, [results, handleMapping]);

  useEffect(() => {
    updateForecast();
  }, [updateForecast]);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Fair': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (current < previous) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const exportToPDF = () => {
    setShowPDFDialog(true);
  };

  if (!results) return null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl mx-auto mt-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Analyzing Financial Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Computing ratios, DuPont analysis, and generating insights...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!financialMetrics) {
    return (
      <>
        <MappingDialog
          isOpen={showMapping}
          onClose={() => setShowMapping(false)}
          onConfirm={handleMapping}
          headers={results.headers || []}
          suggestions={results.suggestions || {}}
          fileName={results.fileName || 'Unknown'}
        />
      </>
    );
  }

  // Prepare chart data
  const periods = financialMetrics.revenue.length;
  const chartData = Array.from({ length: periods }, (_, i) => ({
    period: `Period ${i + 1}`,
    revenue: financialMetrics.revenue[i],
    netIncome: financialMetrics.netIncome[i],
    grossMargin: financialMetrics.profitabilityRatios.grossMargin[i],
    netMargin: financialMetrics.profitabilityRatios.netMargin[i],
    roe: financialMetrics.profitabilityRatios.roe[i],
    roa: financialMetrics.profitabilityRatios.roa[i],
    debtToEquity: financialMetrics.leverageRatios.debtToEquity[i],
    debtToAssets: financialMetrics.leverageRatios.debtToAssets[i] * 100
  }));

  const dupontData = Array.from({ length: periods }, (_, i) => ({
    period: `Period ${i + 1}`,
    netMargin: financialMetrics.dupontAnalysis.netMargin[i],
    assetTurnover: financialMetrics.dupontAnalysis.assetTurnover[i],
    equityMultiplier: financialMetrics.dupontAnalysis.equityMultiplier[i],
    roe: financialMetrics.dupontAnalysis.roe[i]
  }));

  // Prepare forecast chart data
  const forecastChartData = forecastData && 'forecast' in forecastData ? 
    forecastData.forecast.revenue.map((rev: number, i: number) => ({
      month: `Month ${i + 1}`,
      revenue: rev,
      netIncome: forecastData.forecast.netIncome[i]
    })) : [];

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${
                entry.dataKey.includes('Margin') || entry.dataKey.includes('roe') || entry.dataKey.includes('roa') || entry.dataKey.includes('debt')
                  ? formatPercentage(entry.value)
                  : formatCurrency(entry.value)
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto mt-8 space-y-6"
    >
      {/* Header with Summary */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
            >
              Financial Dashboard
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 dark:text-gray-400 mt-2 text-lg"
            >
              {results.fileName} • {periods} periods analyzed • Generated {new Date().toLocaleDateString()}
            </motion.p>
          </div>
          <div className="flex gap-3">
            <motion.button 
              onClick={() => setShowValuation(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <CalculatorIcon className="h-5 w-5" />
              Valuation Models
            </motion.button>
            <motion.button 
              onClick={() => setShowPeerComparison(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserGroupIcon className="h-5 w-5" />
              Industry Comparison
            </motion.button>
            <motion.button 
              onClick={exportToPDF}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Export Report
            </motion.button>
          </div>
        </div>

        {/* Enhanced Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-700/10 p-8 rounded-3xl border border-blue-200/50 dark:border-blue-700/50 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                </div>
                {periods > 1 && getTrendIcon(
                  financialMetrics.summary.revenueCAGR,
                  0
                )}
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {formatPercentage(financialMetrics.summary.revenueCAGR)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Revenue Growth (CAGR)</div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full inline-block">
                {financialMetrics.summary.revenueCAGR > 10 ? 'Excellent Growth' : 
                 financialMetrics.summary.revenueCAGR > 5 ? 'Good Growth' : 'Moderate Growth'}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-900/30 dark:via-green-800/20 dark:to-green-700/10 p-8 rounded-3xl border border-green-200/50 dark:border-green-700/50 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                  <CurrencyDollarIcon className="h-8 w-8 text-white" />
                </div>
                {periods > 1 && getTrendIcon(
                  financialMetrics.profitabilityRatios.roe[periods - 1],
                  financialMetrics.profitabilityRatios.roe[periods - 2] || 0
                )}
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {formatPercentage(financialMetrics.summary.avgROE)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Return on Equity</div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full inline-block">
                {financialMetrics.summary.avgROE > 15 ? 'Excellent ROE' : 
                 financialMetrics.summary.avgROE > 10 ? 'Good ROE' : 'Fair ROE'}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-700/10 p-8 rounded-3xl border border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <ScaleIcon className="h-8 w-8 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  financialMetrics.summary.debtLevel === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  financialMetrics.summary.debtLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {financialMetrics.summary.debtLevel} Risk
                </span>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {formatPercentage(financialMetrics.summary.avgROA)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Return on Assets</div>
              <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full inline-block">
                Asset Efficiency
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-500 p-8 rounded-3xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 rounded-2xl shadow-lg">
                  <CheckCircleIcon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                  <div className={`text-lg font-bold ${
                    financialMetrics.summary.overallHealth === 'Excellent' ? 'text-green-600' :
                    financialMetrics.summary.overallHealth === 'Good' ? 'text-blue-600' :
                    financialMetrics.summary.overallHealth === 'Fair' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {financialMetrics.summary.overallHealth === 'Excellent' ? '95/100' :
                     financialMetrics.summary.overallHealth === 'Good' ? '80/100' :
                     financialMetrics.summary.overallHealth === 'Fair' ? '65/100' : '45/100'}
                  </div>
                </div>
              </div>
              <div className={`text-2xl font-bold mb-2 ${
                financialMetrics.summary.overallHealth === 'Excellent' ? 'text-green-600' :
                financialMetrics.summary.overallHealth === 'Good' ? 'text-blue-600' :
                financialMetrics.summary.overallHealth === 'Fair' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {financialMetrics.summary.overallHealth}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Financial Health</div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-full rounded-full transition-all duration-1000 ${
                  financialMetrics.summary.overallHealth === 'Excellent' ? 'bg-green-500 w-[95%]' :
                  financialMetrics.summary.overallHealth === 'Good' ? 'bg-blue-500 w-[80%]' :
                  financialMetrics.summary.overallHealth === 'Fair' ? 'bg-yellow-500 w-[65%]' : 'bg-red-500 w-[45%]'
                }`}></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        {financialMetrics.alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
              Financial Alerts
            </h3>
            <div className="grid gap-3">
              {financialMetrics.alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    alert.type === 'danger' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' :
                    alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                  }`}
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alert.metric}: {formatPercentage(alert.value)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <div className="flex space-x-2 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-2xl p-2 mb-8">
          {[
            { id: 'overview', label: 'Financial Overview', icon: ChartBarIcon, gradient: 'from-blue-500 to-blue-600' },
            { id: 'ratios', label: 'Ratio Analysis', icon: ScaleIcon, gradient: 'from-green-500 to-green-600' },
            { id: 'dupont', label: 'DuPont Breakdown', icon: ArrowTrendingUpIcon, gradient: 'from-purple-500 to-purple-600' },
            { id: 'cashflow', label: 'Cash Flow Analysis', icon: ArrowPathIcon, gradient: 'from-orange-500 to-orange-600' },
            { id: 'forecast', label: 'Forecast Scenario', icon: ArrowPathIcon, gradient: 'from-orange-500 to-orange-600' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'ratios' | 'dupont' | 'cashflow' | 'forecast')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 flex-1 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105 shadow-${tab.gradient.split('-')[1]}-500/30`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-600/60'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue & Profitability Trends</h3>
                    <p className="text-gray-600 dark:text-gray-400">Track financial performance over time</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="period" stroke="#666" />
                      <YAxis yAxisId="left" stroke="#666" />
                      <YAxis yAxisId="right" orientation="right" stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="left" dataKey="netIncome" fill="#82ca9d" name="Net Income" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="netMargin" stroke="#ff7300" strokeWidth={3} name="Net Margin %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profitability Margins</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gross and net margin evolution</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="period" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="grossMargin" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Gross Margin %" />
                      <Area type="monotone" dataKey="netMargin" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Net Margin %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'ratios' && (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                    <ScaleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profitability Ratios</h3>
                    <p className="text-gray-600 dark:text-gray-400">Key profitability performance indicators</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="period" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="grossMargin" fill="#8884d8" name="Gross Margin %" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="netMargin" fill="#82ca9d" name="Net Margin %" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="roe" fill="#ffc658" name="ROE %" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="roa" fill="#ff7300" name="ROA %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                    <ScaleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Leverage Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-400">Debt and leverage ratio trends</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="period" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="debtToAssets" stroke="#ff7300" strokeWidth={3} name="Debt to Assets %" />
                      <Line type="monotone" dataKey="debtToEquity" stroke="#8884d8" strokeWidth={3} name="Debt to Equity Ratio" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'dupont' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">DuPont Formula</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">
                    ROE = Net Margin × Asset Turnover × Equity Multiplier
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This breakdown helps identify the primary drivers of return on equity performance.
                </p>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={dupontData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="period" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="netMargin" fill="#8884d8" name="Net Margin %" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="assetTurnover" stroke="#82ca9d" strokeWidth={3} name="Asset Turnover" />
                  <Line yAxisId="right" type="monotone" dataKey="equityMultiplier" stroke="#ffc658" strokeWidth={3} name="Equity Multiplier" />
                  <Line yAxisId="left" type="monotone" dataKey="roe" stroke="#ff7300" strokeWidth={4} name="ROE %" strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cash Flow Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive analysis of cash flow from operations, working capital efficiency, and stress testing scenarios.
                </p>
              </div>

              <CashFlowAnalysis 
                data={{
                  'Revenue': financialMetrics.revenue,
                  'COGS': financialMetrics.cogs,
                  'Gross Profit': financialMetrics.grossProfit,
                  'Net Income': financialMetrics.netIncome,
                  'Total Assets': financialMetrics.totalAssets,
                  'Total Liabilities': financialMetrics.totalLiabilities,
                  'Shareholders Equity': financialMetrics.shareholdersEquity,
                  'Cash Flow from Operations': financialMetrics.netIncome.map(ni => ni * 1.2), // Estimate OCF as 1.2x net income
                }}
                periods={Array.from({ length: periods }, (_, i) => `Year ${i + 1}`)}
              />
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forecast Assumptions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Revenue Growth Rate (%)
                    </label>
                    <input
                      type="number"
                      value={forecastAssumptions.revenueGrowth}
                      onChange={(e) => setForecastAssumptions(prev => ({ ...prev, revenueGrowth: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 text-gray-900 dark:text-white"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Margin Assumption
                    </label>
                    <select
                      value={forecastAssumptions.marginAssumption}
                      onChange={(e) => setForecastAssumptions(prev => ({ 
                        ...prev, 
                        marginAssumption: e.target.value as 'maintain' | 'improve' | 'decline'
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="maintain">Maintain Current</option>
                      <option value="improve">Improve by 10%</option>
                      <option value="decline">Decline by 10%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CapEx Growth Rate (%)
                    </label>
                    <input
                      type="number"
                      value={forecastAssumptions.capexGrowth}
                      onChange={(e) => setForecastAssumptions(prev => ({ ...prev, capexGrowth: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 text-gray-900 dark:text-white"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              {forecastData && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">12-Month Revenue & Income Forecast</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={forecastChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" fill="#8884d8" fillOpacity={0.3} stroke="#8884d8" strokeWidth={2} name="Forecasted Revenue" />
                      <Line type="monotone" dataKey="netIncome" stroke="#82ca9d" strokeWidth={3} name="Forecasted Net Income" />
                    </ComposedChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(forecastData.forecast.revenue[11])}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Projected Year-End Revenue</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(forecastData.forecast.netIncome[11])}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Projected Year-End Net Income</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(forecastData.forecast.revenue.reduce((sum: number, val: number) => sum + val, 0))}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Forecasted Revenue</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* PDF Export Dialog */}
      {financialMetrics && (
        <PDFExportDialog
          isOpen={showPDFDialog}
          onClose={() => setShowPDFDialog(false)}
          financialMetrics={financialMetrics}
          fileName={results?.fileName || 'financial-analysis'}
        />
      )}

      {/* Valuation Dialog */}
      {financialMetrics && (
        <ValuationDialog
          isOpen={showValuation}
          onClose={() => setShowValuation(false)}
          financialMetrics={financialMetrics}
        />
      )}

      {/* Peer Comparison Dialog */}
      {financialMetrics && (
        <PeerComparisonDialog
          isOpen={showPeerComparison}
          onClose={() => setShowPeerComparison(false)}
          financialMetrics={financialMetrics}
        />
      )}
    </motion.div>
  );
}
