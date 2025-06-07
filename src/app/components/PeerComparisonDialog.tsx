"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  ScaleIcon,
  LightBulbIcon,
  UserGroupIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { FinancialMetrics } from "../utils/financialAnalysis";
import { 
  PeerComparisonAnalyzer, 
  PeerComparisonResult,
  BenchmarkComparison,
  INDUSTRY_BENCHMARKS
} from "../utils/industryBenchmarks";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface PeerComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  financialMetrics: FinancialMetrics;
}

export default function PeerComparisonDialog({ 
  isOpen, 
  onClose, 
  financialMetrics 
}: PeerComparisonDialogProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<PeerComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzer = useMemo(() => new PeerComparisonAnalyzer(), []);
  const availableIndustries = analyzer.getAvailableIndustries();

  const handleIndustrySelect = async (industry: string) => {
    setSelectedIndustry(industry);
    setIsAnalyzing(true);
    
    try {
      // Get latest period metrics
      const latestIndex = financialMetrics.revenue.length - 1;
      
      const companyMetrics = {
        grossMargin: financialMetrics.profitabilityRatios.grossMargin[latestIndex] || 0,
        netMargin: financialMetrics.profitabilityRatios.netMargin[latestIndex] || 0,
        roe: financialMetrics.profitabilityRatios.roe[latestIndex] || 0,
        roa: financialMetrics.profitabilityRatios.roa[latestIndex] || 0,
        debtToEquity: financialMetrics.leverageRatios.debtToEquity[latestIndex] || 0,
        currentRatio: 1.5, // Default value since we don't always have this
        assetTurnover: financialMetrics.dupontAnalysis.assetTurnover[latestIndex] || 0
      };

      const result = analyzer.performComparison(industry, companyMetrics);
      setComparisonResult(result);
    } catch (error) {
      console.error('Peer comparison failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'average': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'poor': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return <StarIcon className="h-5 w-5" />;
      case 'good': return <CheckCircleIcon className="h-5 w-5" />;
      case 'average': return <InformationCircleIcon className="h-5 w-5" />;
      case 'poor': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  // Prepare radar chart data
  const radarData = comparisonResult?.comparisons.map(comp => ({
    metric: comp.metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    company: comp.percentile,
    industryAverage: 50,
    topQuartile: 75
  })) || [];

  // Prepare benchmark comparison chart data
  const benchmarkChartData = comparisonResult?.comparisons.map(comp => {
    const isPercentage = comp.metric.includes('Margin') || comp.metric.includes('roe') || comp.metric.includes('roa');
    return {
      metric: comp.metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      company: comp.companyValue,
      excellent: comp.industryBenchmark.excellent,
      good: comp.industryBenchmark.good,
      average: comp.industryBenchmark.average,
      poor: comp.industryBenchmark.poor,
      unit: isPercentage ? '%' : ''
    };
  }) || [];

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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Industry Peer Comparison
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Compare your performance against industry benchmarks
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
          <div className="p-6">
            {/* Industry Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5" />
                Select Industry for Comparison
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIndustries.map((industry) => (
                  <motion.button
                    key={industry.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleIndustrySelect(industry.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedIndustry === industry.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {industry.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {industry.sector}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analyzing Peer Comparison
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Comparing your metrics against industry benchmarks...
                </p>
              </div>
            )}

            {/* Comparison Results */}
            {comparisonResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Overall Performance Score */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <TrophyIcon className="h-6 w-6 text-blue-600" />
                      Overall Performance Score
                    </h3>
                    <div className={`px-4 py-2 rounded-full font-bold text-lg ${getPerformanceColor(comparisonResult.overallRating)}`}>
                      {comparisonResult.overallScore.toFixed(0)}/100
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold px-4 py-2 rounded-full ${getPerformanceColor(comparisonResult.overallRating)}`}>
                        {comparisonResult.overallRating.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Performance Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {comparisonResult.selectedIndustry}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Industry Benchmark</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {comparisonResult.comparisons.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Metrics Compared</div>
                    </div>
                  </div>
                </div>

                {/* Performance Radar Chart */}
                <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5" />
                    Performance Radar Analysis
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar 
                        name="Your Company" 
                        dataKey="company" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar 
                        name="Industry Average" 
                        dataKey="industryAverage" 
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Radar 
                        name="Top Quartile" 
                        dataKey="topQuartile" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Metric Comparisons */}
                <div className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ScaleIcon className="h-5 w-5" />
                    Detailed Benchmark Comparison
                  </h3>
                  
                  <div className="space-y-4">
                    {comparisonResult.comparisons.map((comparison, index) => (
                      <motion.div
                        key={comparison.metric}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getPerformanceIcon(comparison.performance)}
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {comparison.metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {comparison.insight}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(comparison.performance)}`}>
                              {comparison.performance.toUpperCase()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {comparison.percentile}th percentile
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                          <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            <div className="font-medium text-red-600">Poor</div>
                            <div>{comparison.industryBenchmark.poor.toFixed(1)}</div>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                            <div className="font-medium text-yellow-600">Average</div>
                            <div>{comparison.industryBenchmark.average.toFixed(1)}</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <div className="font-medium text-blue-600">Good</div>
                            <div>{comparison.industryBenchmark.good.toFixed(1)}</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <div className="font-medium text-green-600">Excellent</div>
                            <div>{comparison.industryBenchmark.excellent.toFixed(1)}</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded border-2 border-purple-200 dark:border-purple-600">
                            <div className="font-bold text-purple-600">Your Score</div>
                            <div className="font-bold">{comparison.companyValue.toFixed(1)}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {comparisonResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-green-700 dark:text-green-300">
                          <CheckCircleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {comparisonResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                          <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Strategic Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                    <LightBulbIcon className="h-5 w-5" />
                    Strategic Recommendations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparisonResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-blue-200 dark:border-blue-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 