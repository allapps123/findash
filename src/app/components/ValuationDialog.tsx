"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  CurrencyDollarIcon,
  CalculatorIcon,
  ScaleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  LightBulbIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { FinancialMetrics } from "../utils/financialAnalysis";
import { 
  ValuationAnalyzer,
  DCFInputs,
  DCFResult,
  ValuationComparison,
  ValuationSummary
} from "../utils/valuationModels";
import { INDUSTRY_BENCHMARKS } from "../utils/industryBenchmarks";
import {
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
  ComposedChart,
  Cell
} from 'recharts';

interface ValuationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  financialMetrics: FinancialMetrics;
}

export default function ValuationDialog({ 
  isOpen, 
  onClose, 
  financialMetrics 
}: ValuationDialogProps) {
  const [activeTab, setActiveTab] = useState<'dcf' | 'comparable' | 'summary'>('dcf');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationSummary | null>(null);
  
  // DCF Inputs
  const [dcfInputs, setDcfInputs] = useState<DCFInputs>({
    initialCashFlow: 0,
    projectionYears: 5,
    revenueGrowthRates: [10, 8, 6, 5, 4],
    terminalGrowthRate: 2.5,
    discountRate: 10,
    netDebt: 0,
    sharesOutstanding: 1000000
  });

  // Comparable Analysis Inputs
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [targetMetrics, setTargetMetrics] = useState({
    revenue: 0,
    ebitda: 0,
    netIncome: 0,
    bookValue: 0
  });

  const analyzer = useMemo(() => new ValuationAnalyzer(), []);
  const availableIndustries = INDUSTRY_BENCHMARKS.map(b => ({ value: b.industry, label: b.industry }));

  // Initialize with financial metrics
  React.useEffect(() => {
    if (financialMetrics && financialMetrics.revenue.length > 0) {
      const latestIndex = financialMetrics.revenue.length - 1;
      const latestRevenue = financialMetrics.revenue[latestIndex];
      const latestNetIncome = financialMetrics.netIncome[latestIndex];
      const latestAssets = financialMetrics.totalAssets[latestIndex];
      const latestLiabilities = financialMetrics.totalLiabilities[latestIndex];

      // Estimate cash flow as a proxy
      const estimatedCashFlow = latestNetIncome * 1.2; // Simple approximation
      const estimatedEbitda = latestNetIncome * 1.5; // Simple approximation
      const bookValue = latestAssets - latestLiabilities;

      setDcfInputs(prev => ({
        ...prev,
        initialCashFlow: estimatedCashFlow,
        netDebt: latestLiabilities * 0.6 // Approximate net debt
      }));

      setTargetMetrics({
        revenue: latestRevenue,
        ebitda: estimatedEbitda,
        netIncome: latestNetIncome,
        bookValue: bookValue
      });
    }
  }, [financialMetrics]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      const result = analyzer.performCompleteValuation(
        dcfInputs,
        selectedIndustry,
        targetMetrics
      );
      setValuationResult(result);
      setActiveTab('summary');
    } catch (error) {
      console.error('Valuation analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  // Prepare DCF chart data
  const dcfChartData = valuationResult?.dcfValuation ? 
    valuationResult.dcfValuation.projectedCashFlows.map((cf, index) => ({
      year: `Year ${index + 1}`,
      projectedCashFlow: cf,
      presentValue: valuationResult.dcfValuation!.presentValues[index]
    })) : [];

  // Prepare sensitivity analysis data
  const sensitivityData = valuationResult?.dcfValuation?.sensitivityAnalysis;
  const sensitivityChartData = sensitivityData ? 
    sensitivityData.growthRates.map((growthRate, i) => ({
      growthRate: `${growthRate.toFixed(1)}%`,
      ...sensitivityData.discountRates.reduce((acc, discountRate, j) => {
        acc[`${discountRate.toFixed(1)}%`] = sensitivityData.valuationMatrix[i][j];
        return acc;
      }, {} as Record<string, number>)
    })) : [];

  // Prepare comparable analysis chart data
  const comparableChartData = valuationResult?.comparableValuation ? [
    { method: 'P/E Valuation', value: valuationResult.comparableValuation.impliedValuations.peValuation },
    { method: 'EV/EBITDA', value: valuationResult.comparableValuation.impliedValuations.evEbitdaValuation },
    { method: 'P/B Valuation', value: valuationResult.comparableValuation.impliedValuations.priceToBookValuation },
    { method: 'Average', value: valuationResult.comparableValuation.impliedValuations.averageValuation }
  ] : [];

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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <CalculatorIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Valuation Models
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  DCF Analysis & Comparable Company Valuation
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

          {/* Tab Navigation */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { id: 'dcf', label: 'DCF Analysis', icon: ChartBarIcon },
                { id: 'comparable', label: 'Comparable Analysis', icon: ScaleIcon },
                { id: 'summary', label: 'Valuation Summary', icon: ClipboardDocumentListIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'dcf' | 'comparable' | 'summary')}
                  className={`flex items-center gap-2 flex-1 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* DCF Analysis Tab */}
            {activeTab === 'dcf' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Discounted Cash Flow Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Initial Cash Flow ($)
                      </label>
                      <input
                        type="number"
                        value={dcfInputs.initialCashFlow}
                        onChange={(e) => setDcfInputs(prev => ({ ...prev, initialCashFlow: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Projection Years
                      </label>
                      <input
                        type="number"
                        value={dcfInputs.projectionYears}
                        onChange={(e) => setDcfInputs(prev => ({ ...prev, projectionYears: parseInt(e.target.value) || 5 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="3"
                        max="10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Terminal Growth Rate (%)
                      </label>
                      <input
                        type="number"
                        value={dcfInputs.terminalGrowthRate}
                        onChange={(e) => setDcfInputs(prev => ({ ...prev, terminalGrowthRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        step="0.1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Discount Rate/WACC (%)
                      </label>
                      <input
                        type="number"
                        value={dcfInputs.discountRate}
                        onChange={(e) => setDcfInputs(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        step="0.1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Net Debt ($)
                      </label>
                      <input
                        type="number"
                        value={dcfInputs.netDebt}
                        onChange={(e) => setDcfInputs(prev => ({ ...prev, netDebt: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Shares Outstanding
                      </label>
                      <input
                        type="number"
                        value={dcfInputs.sharesOutstanding}
                        onChange={(e) => setDcfInputs(prev => ({ ...prev, sharesOutstanding: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Growth Rates */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Annual Growth Rates (%)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {dcfInputs.revenueGrowthRates.map((rate, index) => (
                        <div key={index}>
                          <label className="block text-xs text-gray-500 mb-1">Year {index + 1}</label>
                          <input
                            type="number"
                            value={rate}
                            onChange={(e) => {
                              const newRates = [...dcfInputs.revenueGrowthRates];
                              newRates[index] = parseFloat(e.target.value) || 0;
                              setDcfInputs(prev => ({ ...prev, revenueGrowthRates: newRates }));
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 text-gray-900 dark:text-white"
                            step="0.1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DCF Results */}
                {valuationResult?.dcfValuation && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(valuationResult.dcfValuation.valuePerShare)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Value Per Share</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(valuationResult.dcfValuation.enterpriseValue)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Enterprise Value</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(valuationResult.dcfValuation.equityValue)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Equity Value</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600">
                          {valuationResult.dcfValuation.summary.terminalValuePercent.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Terminal Value %</div>
                      </div>
                    </div>

                    {/* Cash Flow Chart */}
                    <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Projected Cash Flows & Present Values
                      </h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={dcfChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Legend />
                          <Bar dataKey="projectedCashFlow" fill="#3B82F6" name="Projected Cash Flow" />
                          <Line type="monotone" dataKey="presentValue" stroke="#10B981" strokeWidth={3} name="Present Value" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Comparable Analysis Tab */}
            {activeTab === 'comparable' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Comparable Company Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry
                      </label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select Industry</option>
                        {availableIndustries.map((industry) => (
                          <option key={industry.value} value={industry.value}>
                            {industry.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Revenue ($)
                        </label>
                        <input
                          type="number"
                          value={targetMetrics.revenue}
                          onChange={(e) => setTargetMetrics(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          EBITDA ($)
                        </label>
                        <input
                          type="number"
                          value={targetMetrics.ebitda}
                          onChange={(e) => setTargetMetrics(prev => ({ ...prev, ebitda: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Net Income ($)
                        </label>
                        <input
                          type="number"
                          value={targetMetrics.netIncome}
                          onChange={(e) => setTargetMetrics(prev => ({ ...prev, netIncome: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Book Value ($)
                        </label>
                        <input
                          type="number"
                          value={targetMetrics.bookValue}
                          onChange={(e) => setTargetMetrics(prev => ({ ...prev, bookValue: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparable Results */}
                {valuationResult?.comparableValuation && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(valuationResult.comparableValuation.impliedValuations.peValuation)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">P/E Valuation</div>
                        <div className="text-xs text-gray-500">
                          {valuationResult.comparableValuation.peerMultiples.avgPE.toFixed(1)}x multiple
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(valuationResult.comparableValuation.impliedValuations.evEbitdaValuation)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">EV/EBITDA Valuation</div>
                        <div className="text-xs text-gray-500">
                          {valuationResult.comparableValuation.peerMultiples.avgEVEbitda.toFixed(1)}x multiple
                        </div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(valuationResult.comparableValuation.impliedValuations.averageValuation)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Average Valuation</div>
                        <div className="text-xs text-gray-500">Blended approach</div>
                      </div>
                    </div>

                    {/* Valuation Methods Chart */}
                    <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Valuation by Method
                      </h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={comparableChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="method" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {comparableChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && valuationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall Confidence */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Valuation Summary
                    </h3>
                    <div className={`px-4 py-2 rounded-full font-bold ${getConfidenceColor(valuationResult.confidenceLevel)}`}>
                      {valuationResult.confidenceLevel.toUpperCase()} CONFIDENCE
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {valuationResult.dcfValuation && (
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">DCF Valuation</h4>
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {formatCurrency(valuationResult.dcfValuation.valuePerShare)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Per Share</div>
                      </div>
                    )}
                    
                    {valuationResult.comparableValuation && (
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comparable Valuation</h4>
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {formatCurrency(valuationResult.comparableValuation.impliedValuations.averageValuation)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Average Multiple</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Assumptions */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <InformationCircleIcon className="h-5 w-5" />
                    Key Assumptions
                  </h4>
                  <ul className="space-y-2">
                    {valuationResult.keyAssumptions.map((assumption, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                        <span className="text-sm">{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                    <LightBulbIcon className="h-5 w-5" />
                    Strategic Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {valuationResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <h4 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {valuationResult.riskFactors.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                        <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Close
            </button>
            
            <motion.button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                isAnalyzing
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <CalculatorIcon className="h-5 w-5" />
                  Run Valuation Analysis
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 