"use client";
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CpuChipIcon,
  ChartBarIcon,
  BeakerIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
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
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface MonteCarloResult {
  scenarios: number;
  percentiles: {
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  };
  statistics: {
    mean: number;
    stdDev: number;
    minValue: number;
    maxValue: number;
    var95: number;
  };
  distribution: { value: number; frequency: number }[];
  timeSeriesData: { period: number; p5: number; p25: number; p50: number; p75: number; p95: number }[];
}

interface SensitivityAnalysis {
  baseCase: number;
  variables: {
    name: string;
    impact: number;
    lowCase: number;
    highCase: number;
    elasticity: number;
  }[];
  tornadoChart: { variable: string; low: number; high: number; range: number }[];
}

interface ScenarioAnalysis {
  scenarios: {
    name: string;
    probability: number;
    assumptions: Record<string, number>;
    outcomes: {
      revenue: number;
      ebitda: number;
      netIncome: number;
      roe: number;
      roa: number;
    };
    npv: number;
    irr: number;
  }[];
  expectedValue: {
    revenue: number;
    ebitda: number;
    netIncome: number;
    roe: number;
    roa: number;
    npv: number;
  };
  riskMetrics: {
    volatility: number;
    downSideRisk: number;
    upSidePotential: number;
    probabilityOfLoss: number;
  };
}

interface AdvancedAnalyticsProps {
  financialData?: Record<string, number[]>;
  companyName?: string;
}

export default function AdvancedAnalytics({ financialData, companyName = "Sample Company" }: AdvancedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'monte-carlo' | 'sensitivity' | 'scenarios' | 'ai-insights'>('monte-carlo');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResult | null>(null);
  const [sensitivityResults, setSensitivityResults] = useState<SensitivityAnalysis | null>(null);
  const [scenarioResults, setScenarioResults] = useState<ScenarioAnalysis | null>(null);
  const [simulationParams, setSimulationParams] = useState({
    scenarios: 10000,
    timeHorizon: 5,
    confidenceLevel: 95
  });

  // Run Monte Carlo Simulation
  const runMonteCarloSimulation = useCallback(async () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    // Mock Monte Carlo simulation - in real implementation, this would run actual simulation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results: MonteCarloResult = generateMockMonteCarloResults(simulationParams.scenarios);
    setMonteCarloResults(results);
    setIsSimulating(false);
    setSimulationProgress(0);
    clearInterval(progressInterval);
  }, [simulationParams]);

  // Run Sensitivity Analysis
  const runSensitivityAnalysis = useCallback(() => {
    const results: SensitivityAnalysis = generateMockSensitivityResults();
    setSensitivityResults(results);
  }, []);

  // Run Scenario Analysis
  const runScenarioAnalysis = useCallback(() => {
    const results: ScenarioAnalysis = generateMockScenarioResults();
    setScenarioResults(results);
  }, []);

  // Generate mock data functions
  const generateMockMonteCarloResults = (scenarios: number): MonteCarloResult => {
    const distribution = Array.from({ length: 50 }, (_, i) => {
      const value = -2 + (i * 4 / 49); // Range from -2 to +2 standard deviations
      const frequency = Math.exp(-0.5 * value * value) / Math.sqrt(2 * Math.PI);
      return { value: value * 20 + 100, frequency: frequency * scenarios / 10 };
    });

    const timeSeriesData = Array.from({ length: simulationParams.timeHorizon }, (_, i) => ({
      period: i + 1,
      p5: 100 + (i * 5) + Math.random() * 10 - 20,
      p25: 100 + (i * 8) + Math.random() * 10 - 10,
      p50: 100 + (i * 12) + Math.random() * 10,
      p75: 100 + (i * 16) + Math.random() * 10 + 10,
      p95: 100 + (i * 20) + Math.random() * 10 + 20
    }));

    return {
      scenarios,
      percentiles: {
        p5: 65,
        p25: 85,
        p50: 100,
        p75: 115,
        p95: 135
      },
      statistics: {
        mean: 100,
        stdDev: 20,
        minValue: 45,
        maxValue: 155,
        var95: 32.8
      },
      distribution,
      timeSeriesData
    };
  };

  const generateMockSensitivityResults = (): SensitivityAnalysis => {
    const variables = [
      { name: 'Revenue Growth', impact: 15.2, lowCase: -10, highCase: 25, elasticity: 1.8 },
      { name: 'Gross Margin', impact: 12.8, lowCase: -5, highCase: 8, elasticity: 1.4 },
      { name: 'Operating Leverage', impact: 8.6, lowCase: -15, highCase: 12, elasticity: 0.9 },
      { name: 'Tax Rate', impact: -6.2, lowCase: 15, highCase: 35, elasticity: -0.7 },
      { name: 'WACC', impact: -11.4, lowCase: 8, highCase: 15, elasticity: -1.2 },
      { name: 'Terminal Growth', impact: 9.8, lowCase: 1, highCase: 4, elasticity: 1.1 }
    ];

    const tornadoChart = variables.map(v => ({
      variable: v.name,
      low: 100 + v.impact * (v.lowCase / 100),
      high: 100 + v.impact * (v.highCase / 100),
      range: Math.abs(v.impact * (v.highCase - v.lowCase) / 100)
    })).sort((a, b) => b.range - a.range);

    return {
      baseCase: 100,
      variables,
      tornadoChart
    };
  };

  const generateMockScenarioResults = (): ScenarioAnalysis => {
    const scenarios = [
      {
        name: 'Bull Case',
        probability: 0.25,
        assumptions: { revenueGrowth: 20, marginExpansion: 2, marketMultiple: 18 },
        outcomes: { revenue: 150, ebitda: 45, netIncome: 32, roe: 18.5, roa: 12.8 },
        npv: 145,
        irr: 22.5
      },
      {
        name: 'Base Case',
        probability: 0.50,
        assumptions: { revenueGrowth: 10, marginExpansion: 0, marketMultiple: 15 },
        outcomes: { revenue: 110, ebitda: 28, netIncome: 20, roe: 15.2, roa: 9.8 },
        npv: 100,
        irr: 15.0
      },
      {
        name: 'Bear Case',
        probability: 0.25,
        assumptions: { revenueGrowth: -5, marginExpansion: -1, marketMultiple: 12 },
        outcomes: { revenue: 85, ebitda: 18, netIncome: 12, roe: 8.5, roa: 6.2 },
        npv: 65,
        irr: 8.5
      }
    ];

    const expectedValue = {
      revenue: scenarios.reduce((sum, s) => sum + s.outcomes.revenue * s.probability, 0),
      ebitda: scenarios.reduce((sum, s) => sum + s.outcomes.ebitda * s.probability, 0),
      netIncome: scenarios.reduce((sum, s) => sum + s.outcomes.netIncome * s.probability, 0),
      roe: scenarios.reduce((sum, s) => sum + s.outcomes.roe * s.probability, 0),
      roa: scenarios.reduce((sum, s) => sum + s.outcomes.roa * s.probability, 0),
      npv: scenarios.reduce((sum, s) => sum + s.npv * s.probability, 0)
    };

    return {
      scenarios,
      expectedValue,
      riskMetrics: {
        volatility: 15.8,
        downSideRisk: 35,
        upSidePotential: 45,
        probabilityOfLoss: 0.25
      }
    };
  };

  // AI Insights generation
  const aiInsights = useMemo(() => [
    {
      type: 'trend',
      title: 'Revenue Acceleration Detected',
      description: 'Q-over-Q revenue growth shows accelerating trend with 95% confidence',
      impact: 'positive',
      confidence: 95
    },
    {
      type: 'risk',
      title: 'Working Capital Efficiency Declining',
      description: 'Cash conversion cycle extended by 12 days, indicating potential collection issues',
      impact: 'negative',
      confidence: 87
    },
    {
      type: 'opportunity',
      title: 'Margin Expansion Potential',
      description: 'Operating leverage suggests 200bps margin upside with 15% revenue growth',
      impact: 'positive',
      confidence: 78
    },
    {
      type: 'alert',
      title: 'Debt Maturity Concentration',
      description: '68% of debt matures within 24 months, refinancing risk identified',
      impact: 'negative',
      confidence: 92
    }
  ], []);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(1)}M`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <ArrowTrendingUpIcon className="h-5 w-5" />;
      case 'risk': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'opportunity': return <LightBulbIcon className="h-5 w-5" />;
      case 'alert': return <InformationCircleIcon className="h-5 w-5" />;
      default: return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'from-green-500 to-green-600';
      case 'negative': return 'from-red-500 to-red-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const tabConfig = [
    {
      id: 'monte-carlo' as const,
      label: 'Monte Carlo',
      icon: BeakerIcon,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'sensitivity' as const,
      label: 'Sensitivity',
      icon: AdjustmentsHorizontalIcon,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'scenarios' as const,
      label: 'Scenarios',
      icon: ArrowPathIcon,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'ai-insights' as const,
      label: 'AI Insights',
      icon: CpuChipIcon,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🔬 Advanced Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Sophisticated financial modeling and scenario analysis for {companyName}
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

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'monte-carlo' && (
            <div className="space-y-8">
              {/* Simulation Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Monte Carlo Simulation Parameters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Scenarios
                    </label>
                    <input
                      type="number"
                      value={simulationParams.scenarios}
                      onChange={(e) => setSimulationParams(prev => ({ 
                        ...prev, 
                        scenarios: parseInt(e.target.value) || 10000 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1000"
                      max="100000"
                      step="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Time Horizon (Years)
                    </label>
                    <input
                      type="number"
                      value={simulationParams.timeHorizon}
                      onChange={(e) => setSimulationParams(prev => ({ 
                        ...prev, 
                        timeHorizon: parseInt(e.target.value) || 5 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confidence Level (%)
                    </label>
                    <input
                      type="number"
                      value={simulationParams.confidenceLevel}
                      onChange={(e) => setSimulationParams(prev => ({ 
                        ...prev, 
                        confidenceLevel: parseInt(e.target.value) || 95 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="80"
                      max="99"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <motion.button
                    onClick={runMonteCarloSimulation}
                    disabled={isSimulating}
                    whileHover={{ scale: isSimulating ? 1 : 1.05 }}
                    whileTap={{ scale: isSimulating ? 1 : 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isSimulating 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg'
                    } text-white`}
                  >
                    {isSimulating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Running Simulation...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="h-5 w-5" />
                        Run Simulation
                      </>
                    )}
                  </motion.button>
                  {isSimulating && (
                    <div className="flex-1 max-w-xs">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Progress: {simulationProgress.toFixed(0)}%
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${simulationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Monte Carlo Results */}
              {monteCarloResults && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Distribution Chart */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Outcome Distribution
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monteCarloResults.distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="value" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="frequency" 
                            stroke="#3B82F6" 
                            fill="#3B82F6" 
                            fillOpacity={0.6} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Statistical Summary
                    </h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Mean', value: monteCarloResults.statistics.mean, format: (v: number) => v.toFixed(1) },
                        { label: 'Standard Deviation', value: monteCarloResults.statistics.stdDev, format: (v: number) => v.toFixed(1) },
                        { label: '95% VaR', value: monteCarloResults.statistics.var95, format: (v: number) => v.toFixed(1) },
                        { label: '5th Percentile', value: monteCarloResults.percentiles.p5, format: (v: number) => v.toFixed(1) },
                        { label: '95th Percentile', value: monteCarloResults.percentiles.p95, format: (v: number) => v.toFixed(1) }
                      ].map((stat, index) => (
                        <div key={stat.label} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {stat.format(stat.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Series Projection */}
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Confidence Intervals Over Time
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={monteCarloResults.timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="p95" stackId="1" stroke="#DC2626" fill="#DC2626" fillOpacity={0.1} name="95th Percentile" />
                          <Area type="monotone" dataKey="p75" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="75th Percentile" />
                          <Line type="monotone" dataKey="p50" stroke="#3B82F6" strokeWidth={3} name="Median" />
                          <Area type="monotone" dataKey="p25" stackId="3" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="25th Percentile" />
                          <Area type="monotone" dataKey="p5" stackId="4" stroke="#059669" fill="#059669" fillOpacity={0.1} name="5th Percentile" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sensitivity' && (
            <div className="space-y-8">
              {/* Run Sensitivity Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Sensitivity Analysis
                  </h3>
                  <motion.button
                    onClick={runSensitivityAnalysis}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    Run Analysis
                  </motion.button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyze how changes in key variables impact valuation and financial metrics.
                </p>
              </div>

              {/* Sensitivity Results */}
              {sensitivityResults && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Tornado Chart */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Tornado Chart
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={sensitivityResults.tornadoChart} 
                          layout="horizontal"
                          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="variable" />
                          <Tooltip />
                          <Bar dataKey="low" fill="#EF4444" name="Low Case" />
                          <Bar dataKey="high" fill="#10B981" name="High Case" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Variable Impact Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Variable Impact Analysis
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Variable</th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Impact</th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Elasticity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sensitivityResults.variables.map((variable, index) => (
                            <tr key={variable.name} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                                {variable.name}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className={`font-semibold ${
                                  variable.impact > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {variable.impact > 0 ? '+' : ''}{variable.impact.toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">
                                {variable.elasticity.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="space-y-8">
              {/* Run Scenario Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Scenario Analysis
                  </h3>
                  <motion.button
                    onClick={runScenarioAnalysis}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Run Analysis
                  </motion.button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare Bull, Base, and Bear case scenarios with probability-weighted outcomes.
                </p>
              </div>

              {/* Scenario Results */}
              {scenarioResults && (
                <div className="space-y-8">
                  {/* Scenario Comparison */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      Scenario Comparison
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Scenario</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Probability</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Revenue</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">EBITDA</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">ROE</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">NPV</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">IRR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenarioResults.scenarios.map((scenario, index) => (
                            <tr key={scenario.name} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                                {scenario.name}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                {formatPercent(scenario.probability * 100)}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                {formatCurrency(scenario.outcomes.revenue)}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                {formatCurrency(scenario.outcomes.ebitda)}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                {formatPercent(scenario.outcomes.roe)}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                {scenario.npv.toFixed(0)}
                              </td>
                              <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                {formatPercent(scenario.irr)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Expected Value and Risk Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Expected Value
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Revenue', value: scenarioResults.expectedValue.revenue },
                          { label: 'EBITDA', value: scenarioResults.expectedValue.ebitda },
                          { label: 'Net Income', value: scenarioResults.expectedValue.netIncome },
                          { label: 'ROE', value: scenarioResults.expectedValue.roe },
                          { label: 'NPV', value: scenarioResults.expectedValue.npv }
                        ].map((metric) => (
                          <div key={metric.label} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {metric.label.includes('Revenue') || metric.label.includes('EBITDA') || metric.label.includes('Income') ? 
                                formatCurrency(metric.value) : 
                                (metric.label === 'NPV' ? metric.value.toFixed(0) : formatPercent(metric.value))
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Risk Metrics
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Volatility', value: scenarioResults.riskMetrics.volatility, format: formatPercent },
                          { label: 'Downside Risk', value: scenarioResults.riskMetrics.downSideRisk, format: formatPercent },
                          { label: 'Upside Potential', value: scenarioResults.riskMetrics.upSidePotential, format: formatPercent },
                          { label: 'Probability of Loss', value: scenarioResults.riskMetrics.probabilityOfLoss * 100, format: formatPercent }
                        ].map((metric) => (
                          <div key={metric.label} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400">{metric.label}</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {metric.format(metric.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-8">
              {/* AI Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(insight.impact)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {insight.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            insight.impact === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            insight.impact === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {insight.impact === 'positive' ? 'Positive' : insight.impact === 'negative' ? 'Risk' : 'Neutral'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 