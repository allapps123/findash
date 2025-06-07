"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from "recharts";
import {
  CashFlowAnalyzer,
  StressTestingEngine,
  generateCashFlowInsights,
  type CashFlowMetrics,
  type WorkingCapitalAnalysis,
  type StressTestScenario,
  type StressTestResult
} from "../utils/cashFlowAnalysis";

interface CashFlowAnalysisProps {
  data: Record<string, number[]>;
  periods: string[];
}

export default function CashFlowAnalysis({ data, periods }: CashFlowAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'working-capital' | 'stress-test'>('overview');
  const [selectedScenario, setSelectedScenario] = useState<StressTestScenario | null>(null);
  const [stressTestResult, setStressTestResult] = useState<StressTestResult | null>(null);

  // Initialize analyzers
  const cashFlowAnalyzer = new CashFlowAnalyzer(data);
  const stressTestEngine = new StressTestingEngine(data);
  
  // Get analysis results
  const cashFlowMetrics = cashFlowAnalyzer.analyzeCashFlow();
  const workingCapitalAnalysis = cashFlowAnalyzer.analyzeWorkingCapital();
  const insights = generateCashFlowInsights(cashFlowMetrics);
  const stressScenarios = stressTestEngine.getStandardScenarios();

  // Prepare chart data
  const cashFlowChartData = periods.map((period, index) => ({
    period,
    operatingCashFlow: cashFlowMetrics.operatingCashToSales[index] || 0,
    freeCashFlow: cashFlowMetrics.freeCashFlowYield[index] || 0,
    capexRatio: cashFlowMetrics.capexToRevenue[index] || 0,
    sustainabilityScore: cashFlowMetrics.sustainabilityScore[index] || 0
  }));

  const workingCapitalChartData = periods.map((period, index) => ({
    period,
    dso: workingCapitalAnalysis.daysInReceivables[index] || 0,
    dio: workingCapitalAnalysis.daysInInventory[index] || 0,
    dpo: workingCapitalAnalysis.daysInPayables[index] || 0,
    ccc: workingCapitalAnalysis.cashConversionCycle[index] || 0,
    wcIntensity: workingCapitalAnalysis.workingCapitalIntensity[index] || 0
  }));

  const handleStressTest = (scenario: StressTestScenario) => {
    setSelectedScenario(scenario);
    const result = stressTestEngine.runStressTest(scenario);
    setStressTestResult(result);
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-green-600 dark:text-green-400';
      case 'Good': return 'text-blue-600 dark:text-blue-400';
      case 'Fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'Poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAlertIcon = (type: 'warning' | 'danger' | 'info') => {
    switch (type) {
      case 'danger': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info': return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const tabConfig = [
    {
      id: 'overview' as const,
      label: 'Cash Flow Overview',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'working-capital' as const,
      label: 'Working Capital',
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'stress-test' as const,
      label: 'Stress Testing',
      icon: ShieldCheckIcon,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Cash Flow Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Deep dive into cash generation, working capital efficiency, and stress scenarios
        </p>
      </div>

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

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "OCF/Net Income",
            value: cashFlowMetrics.operatingCashToNetIncome[cashFlowMetrics.operatingCashToNetIncome.length - 1],
            format: formatPercent,
            icon: ArrowTrendingUpIcon,
            color: "from-blue-500 to-blue-600",
            benchmark: 100,
            isGoodHigh: true
          },
          {
            label: "Free Cash Flow Yield",
            value: cashFlowMetrics.freeCashFlowYield[cashFlowMetrics.freeCashFlowYield.length - 1],
            format: formatPercent,
            icon: CurrencyDollarIcon,
            color: "from-green-500 to-green-600",
            benchmark: 5,
            isGoodHigh: true
          },
          {
            label: "Cash Conversion Cycle",
            value: workingCapitalAnalysis.cashConversionCycle[workingCapitalAnalysis.cashConversionCycle.length - 1],
            format: (v: number) => `${v.toFixed(0)} days`,
            icon: ClockIcon,
            color: "from-purple-500 to-purple-600",
            benchmark: 60,
            isGoodHigh: false
          },
          {
            label: "Sustainability Score",
            value: cashFlowMetrics.sustainabilityScore[cashFlowMetrics.sustainabilityScore.length - 1],
            format: (v: number) => `${v.toFixed(0)}/100`,
            icon: ShieldCheckIcon,
            color: "from-orange-500 to-orange-600",
            benchmark: 70,
            isGoodHigh: true
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
              {metric.isGoodHigh ? 
                (metric.value >= metric.benchmark ? 
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" /> : 
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                ) : 
                (metric.value <= metric.benchmark ? 
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" /> : 
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                )
              }
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.format(metric.value)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {metric.label}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Benchmark: {metric.format(metric.benchmark)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Cash Flow Health & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Health Assessment */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  Cash Flow Health
                </h3>
                <div className="space-y-4">
                  {periods.map((period, index) => (
                    <div key={period} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{period}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${getHealthColor(cashFlowMetrics.cashFlowHealth[index])}`}>
                          {cashFlowMetrics.cashFlowHealth[index]}
                        </span>
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${
                              cashFlowMetrics.cashFlowHealth[index] === 'Excellent' ? 'from-green-400 to-green-600' :
                              cashFlowMetrics.cashFlowHealth[index] === 'Good' ? 'from-blue-400 to-blue-600' :
                              cashFlowMetrics.cashFlowHealth[index] === 'Fair' ? 'from-yellow-400 to-yellow-600' :
                              'from-red-400 to-red-600'
                            }`}
                            style={{ 
                              width: `${
                                cashFlowMetrics.cashFlowHealth[index] === 'Excellent' ? 100 :
                                cashFlowMetrics.cashFlowHealth[index] === 'Good' ? 75 :
                                cashFlowMetrics.cashFlowHealth[index] === 'Fair' ? 50 : 25
                              }%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                  Key Alerts
                </h3>
                <div className="space-y-4">
                  {cashFlowMetrics.alerts.length > 0 ? (
                    cashFlowMetrics.alerts.map((alert, index) => (
                      <div key={index} className={`p-4 rounded-xl border-l-4 ${
                        alert.type === 'danger' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' :
                        'bg-blue-50 dark:bg-blue-950/20 border-blue-500'
                      }`}>
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {alert.metric}: {formatPercent(alert.value)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <CheckCircleIcon className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p>No critical alerts detected</p>
                      <p className="text-sm">Cash flow metrics look healthy</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cash Flow Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Cash Flow Performance Trends
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlowChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="period" 
                      className="text-xs"
                      stroke="currentColor"
                    />
                    <YAxis 
                      className="text-xs"
                      stroke="currentColor"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                    <Bar 
                      dataKey="operatingCashFlow" 
                      fill="url(#cashFlowGradient)" 
                      name="OCF/Sales %"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="freeCashFlow" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="FCF Yield %"
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sustainabilityScore" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Sustainability Score"
                      dot={{ fill: '#F59E0B', strokeWidth: 2 }}
                    />
                    <defs>
                      <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CpuChipIcon className="h-6 w-6 text-purple-500" />
                AI-Generated Insights
              </h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'working-capital' && (
          <div className="space-y-8">
            {/* Working Capital Components */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Cash Conversion Cycle Analysis
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={workingCapitalChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="period" 
                      className="text-xs"
                      stroke="currentColor"
                    />
                    <YAxis 
                      className="text-xs"
                      stroke="currentColor"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                    <Bar dataKey="dso" stackId="a" fill="#3B82F6" name="DSO (Days)" />
                    <Bar dataKey="dio" stackId="a" fill="#10B981" name="DIO (Days)" />
                    <Bar dataKey="dpo" stackId="a" fill="#EF4444" name="DPO (Days)" />
                    <Line 
                      type="monotone" 
                      dataKey="ccc" 
                      stroke="#F59E0B" 
                      strokeWidth={4}
                      name="Cash Conversion Cycle"
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>DSO = Days Sales Outstanding | DIO = Days Inventory Outstanding | DPO = Days Payable Outstanding</p>
                <p>Cash Conversion Cycle = DSO + DIO - DPO (lower is better)</p>
              </div>
            </div>

            {/* Working Capital Efficiency Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Receivables Management",
                  value: workingCapitalAnalysis.daysInReceivables[workingCapitalAnalysis.daysInReceivables.length - 1],
                  format: (v: number) => `${v.toFixed(0)} days`,
                  benchmark: 30,
                  isGoodLow: true,
                  color: "from-blue-500 to-blue-600",
                  description: "Average collection period"
                },
                {
                  title: "Inventory Efficiency",
                  value: workingCapitalAnalysis.daysInInventory[workingCapitalAnalysis.daysInInventory.length - 1],
                  format: (v: number) => `${v.toFixed(0)} days`,
                  benchmark: 45,
                  isGoodLow: true,
                  color: "from-green-500 to-green-600",
                  description: "Inventory holding period"
                },
                {
                  title: "Payables Optimization",
                  value: workingCapitalAnalysis.daysInPayables[workingCapitalAnalysis.daysInPayables.length - 1],
                  format: (v: number) => `${v.toFixed(0)} days`,
                  benchmark: 30,
                  isGoodLow: false,
                  color: "from-purple-500 to-purple-600",
                  description: "Average payment period"
                }
              ].map((metric, index) => (
                <div key={metric.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center mb-4`}>
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {metric.title}
                  </h4>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {metric.format(metric.value)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {metric.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Benchmark: {metric.format(metric.benchmark)}</span>
                    {metric.isGoodLow ? 
                      (metric.value <= metric.benchmark ? 
                        <span className="text-green-500 font-medium">Good</span> : 
                        <span className="text-red-500 font-medium">Needs Improvement</span>
                      ) : 
                      (metric.value >= metric.benchmark ? 
                        <span className="text-green-500 font-medium">Good</span> : 
                        <span className="text-red-500 font-medium">Needs Improvement</span>
                      )
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stress-test' && (
          <div className="space-y-8">
            {/* Stress Test Scenarios */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Stress Test Scenarios
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stressScenarios.map((scenario, index) => (
                  <motion.button
                    key={scenario.name}
                    onClick={() => handleStressTest(scenario)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                      selectedScenario?.name === scenario.name
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {scenario.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {scenario.description}
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Revenue Impact: {scenario.assumptions.revenueShock}%</div>
                      <div>Margin Pressure: {scenario.assumptions.marginPressure} bps</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stress Test Results */}
            {stressTestResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Stress Test Results: {selectedScenario?.name}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Impact Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Financial Impact
                    </h4>
                    <div className="space-y-4">
                      {[
                        { label: "Revenue", value: stressTestResult.impactedMetrics.revenue, format: formatCurrency },
                        { label: "Operating Cash Flow", value: stressTestResult.impactedMetrics.operatingCashFlow, format: formatCurrency },
                        { label: "Free Cash Flow", value: stressTestResult.impactedMetrics.freeCashFlow, format: formatCurrency },
                        { label: "Liquidity Ratio", value: stressTestResult.impactedMetrics.liquidityRatio, format: (v: number) => `${v.toFixed(1)}x` }
                      ].map((metric) => (
                        <div key={metric.label} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                          <span className={`font-semibold ${
                            metric.value < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {metric.format(metric.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Survival Analysis */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Survival Analysis
                    </h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="text-sm text-red-600 dark:text-red-400 mb-1">Cash Runway</div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                          {stressTestResult.survivalAnalysis.monthsOfCashRemaining.toFixed(1)} months
                        </div>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Break-even Gap</div>
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                          {stressTestResult.survivalAnalysis.breakEvenPoint.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Recovery Time</div>
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                          {stressTestResult.survivalAnalysis.recoveryTimeMonths} months
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Strategic Recommendations
                  </h4>
                  <div className="space-y-3">
                    {stressTestResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          recommendation.includes('URGENT') ? 'bg-red-500' :
                          recommendation.includes('Establish') || recommendation.includes('Review') ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
} 