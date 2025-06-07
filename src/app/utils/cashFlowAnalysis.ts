// Cash Flow Analysis Module for FinDash Phase 2
// Provides comprehensive cash flow statement analysis

export interface CashFlowData {
  // Operating Activities
  operatingCashFlow: number[];
  netIncomeStartPoint: number[];
  depreciationAmortization: number[];
  workingCapitalChanges: number[];
  otherOperatingAdjustments: number[];
  
  // Investing Activities  
  investingCashFlow: number[];
  capitalExpenditures: number[];
  acquisitions: number[];
  assetSales: number[];
  investmentPurchases: number[];
  
  // Financing Activities
  financingCashFlow: number[];
  debtIssuance: number[];
  debtRepayment: number[];
  equityIssuance: number[];
  dividendPayments: number[];
  shareRepurchases: number[];
  
  // Summary
  netCashChange: number[];
  beginningCash: number[];
  endingCash: number[];
}

export interface CashFlowMetrics {
  // Quality Ratios
  operatingCashToNetIncome: number[];
  operatingCashToSales: number[];
  freeCashFlow: number[];
  freeCashFlowYield: number[];
  
  // Coverage Ratios
  cashCoverageRatio: number[];
  debtServiceCoverage: number[];
  dividendCoverage: number[];
  
  // Efficiency Metrics
  cashConversionCycle: number[];
  workingCapitalTurnover: number[];
  capexToRevenue: number[];
  
  // Growth & Sustainability
  fcfGrowthRate: number[];
  cashFlowStability: number[];
  reinvestmentRate: number[];
  
  // Analysis
  cashFlowHealth: string[];
  sustainabilityScore: number[];
  alerts: {
    type: 'warning' | 'danger' | 'info';
    message: string;
    metric: string;
    value: number;
  }[];
}

export interface WorkingCapitalAnalysis {
  // Components
  accountsReceivable: number[];
  inventory: number[];
  accountsPayable: number[];
  workingCapital: number[];
  
  // Turnover Ratios
  receivablesTurnover: number[];
  inventoryTurnover: number[];
  payablesTurnover: number[];
  
  // Days Metrics
  daysInReceivables: number[]; // DSO
  daysInInventory: number[]; // DIO
  daysInPayables: number[]; // DPO
  cashConversionCycle: number[]; // DSO + DIO - DPO
  
  // Efficiency Analysis
  workingCapitalIntensity: number[];
  workingCapitalTrend: string[];
  efficiencyScore: number[];
}

export class CashFlowAnalyzer {
  constructor(private data: Record<string, number[]>) {}

  analyzeCashFlow(): CashFlowMetrics {
    const operating = this.data['Cash Flow from Operations'] || [];
    const netIncome = this.data['Net Income'] || [];
    const revenue = this.data['Revenue'] || [];
    const capex = this.data['Capital Expenditures'] || operating.map(() => 0);
    const dividends = this.data['Dividends Paid'] || operating.map(() => 0);
    const totalDebt = this.data['Total Debt'] || this.data['Total Liabilities'] || [];
    
    // Calculate Free Cash Flow
    const freeCashFlow = operating.map((ocf, i) => ocf - (capex[i] || 0));
    
    // Quality Ratios
    const operatingCashToNetIncome = operating.map((ocf, i) => 
      netIncome[i] ? (ocf / netIncome[i]) * 100 : 0
    );
    
    const operatingCashToSales = operating.map((ocf, i) => 
      revenue[i] ? (ocf / revenue[i]) * 100 : 0
    );
    
    const freeCashFlowYield = freeCashFlow.map((fcf, i) => 
      revenue[i] ? (fcf / revenue[i]) * 100 : 0
    );
    
    // Coverage Ratios
    const cashCoverageRatio = operating.map((ocf, i) => 
      totalDebt[i] ? ocf / totalDebt[i] : 0
    );
    
    const dividendCoverage = operating.map((ocf, i) => 
      dividends[i] ? ocf / dividends[i] : 0
    );
    
    // Efficiency Metrics
    const capexToRevenue = capex.map((cx, i) => 
      revenue[i] ? (cx / revenue[i]) * 100 : 0
    );
    
    // Growth Analysis
    const fcfGrowthRate = freeCashFlow.map((fcf, i) => {
      if (i === 0 || !freeCashFlow[i-1]) return 0;
      return ((fcf - freeCashFlow[i-1]) / Math.abs(freeCashFlow[i-1])) * 100;
    });
    
    // Cash Flow Stability (coefficient of variation)
    const cashFlowStability = this.calculateStability(operating);
    
    // Reinvestment Rate
    const reinvestmentRate = capex.map((cx, i) => 
      operating[i] ? (cx / operating[i]) * 100 : 0
    );
    
    // Health Assessment
    const cashFlowHealth = operating.map((ocf, i) => {
      const ocfToNI = operatingCashToNetIncome[i];
      const fcf = freeCashFlow[i];
      
      if (ocf > 0 && fcf > 0 && ocfToNI > 80) return 'Excellent';
      if (ocf > 0 && fcf > 0 && ocfToNI > 60) return 'Good';
      if (ocf > 0 && fcf >= 0) return 'Fair';
      return 'Poor';
    });
    
    // Sustainability Score (0-100)
    const sustainabilityScore = operating.map((ocf, i) => {
      let score = 0;
      
      // Operating Cash Flow positive (25 points)
      if (ocf > 0) score += 25;
      
      // Free Cash Flow positive (25 points)
      if (freeCashFlow[i] > 0) score += 25;
      
      // OCF > Net Income (20 points)
      if (operatingCashToNetIncome[i] > 100) score += 20;
      
      // Strong FCF yield (15 points)
      if (freeCashFlowYield[i] > 10) score += 15;
      else if (freeCashFlowYield[i] > 5) score += 10;
      
      // Reasonable capex (15 points)
      if (capexToRevenue[i] < 10) score += 15;
      else if (capexToRevenue[i] < 15) score += 10;
      
      return Math.min(score, 100);
    });
    
    // Generate Alerts
    const alerts = this.generateCashFlowAlerts({
      operatingCashToNetIncome,
      freeCashFlow,
      capexToRevenue,
      operating
    });
    
    return {
      operatingCashToNetIncome,
      operatingCashToSales,
      freeCashFlow,
      freeCashFlowYield,
      cashCoverageRatio,
      debtServiceCoverage: cashCoverageRatio, // Simplified
      dividendCoverage,
      cashConversionCycle: [], // Will be calculated in working capital analysis
      workingCapitalTurnover: [],
      capexToRevenue,
      fcfGrowthRate,
      cashFlowStability: [cashFlowStability],
      reinvestmentRate,
      cashFlowHealth,
      sustainabilityScore,
      alerts
    };
  }

  analyzeWorkingCapital(): WorkingCapitalAnalysis {
    // Get basic data
    const revenue = this.data['Revenue'] || [];
    const cogs = this.data['COGS'] || [];
    
    // Estimate working capital components if not provided
    const accountsReceivable = this.data['Accounts Receivable'] || 
      revenue.map(r => r * 0.12); // Assume 12% of revenue
    
    const inventory = this.data['Inventory'] || 
      cogs.map(c => c * 0.15); // Assume 15% of COGS
    
    const accountsPayable = this.data['Accounts Payable'] || 
      cogs.map(c => c * 0.10); // Assume 10% of COGS
    
    const workingCapital = accountsReceivable.map((ar, i) => 
      ar + inventory[i] - accountsPayable[i]
    );
    
    // Calculate turnover ratios
    const receivablesTurnover = accountsReceivable.map((ar, i) => 
      ar ? revenue[i] / ar : 0
    );
    
    const inventoryTurnover = inventory.map((inv, i) => 
      inv ? cogs[i] / inv : 0
    );
    
    const payablesTurnover = accountsPayable.map((ap, i) => 
      ap ? cogs[i] / ap : 0
    );
    
    // Calculate days metrics
    const daysInReceivables = receivablesTurnover.map(rt => rt ? 365 / rt : 0);
    const daysInInventory = inventoryTurnover.map(it => it ? 365 / it : 0);
    const daysInPayables = payablesTurnover.map(pt => pt ? 365 / pt : 0);
    
    // Cash Conversion Cycle
    const cashConversionCycle = daysInReceivables.map((dso, i) => 
      dso + daysInInventory[i] - daysInPayables[i]
    );
    
    // Working Capital Intensity
    const workingCapitalIntensity = workingCapital.map((wc, i) => 
      revenue[i] ? (wc / revenue[i]) * 100 : 0
    );
    
    // Trend Analysis
    const workingCapitalTrend = workingCapital.map((wc, i) => {
      if (i === 0) return 'Baseline';
      const prevWC = workingCapital[i-1];
      if (!prevWC) return 'Unknown';
      
      const change = ((wc - prevWC) / Math.abs(prevWC)) * 100;
      if (change > 10) return 'Increasing';
      if (change < -10) return 'Decreasing';
      return 'Stable';
    });
    
    // Efficiency Score
    const efficiencyScore = cashConversionCycle.map(ccc => {
      if (ccc < 30) return 100;
      if (ccc < 60) return 80;
      if (ccc < 90) return 60;
      if (ccc < 120) return 40;
      return 20;
    });
    
    return {
      accountsReceivable,
      inventory,
      accountsPayable,
      workingCapital,
      receivablesTurnover,
      inventoryTurnover,
      payablesTurnover,
      daysInReceivables,
      daysInInventory,
      daysInPayables,
      cashConversionCycle,
      workingCapitalIntensity,
      workingCapitalTrend,
      efficiencyScore
    };
  }

  private calculateStability(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;
  }

  private generateCashFlowAlerts(metrics: any): CashFlowMetrics['alerts'] {
    const alerts: CashFlowMetrics['alerts'] = [];
    const latest = metrics.operatingCashToNetIncome.length - 1;
    
    // Check OCF to Net Income ratio
    if (metrics.operatingCashToNetIncome[latest] < 50) {
      alerts.push({
        type: 'danger',
        message: 'Operating cash flow significantly below net income - possible earnings quality issues',
        metric: 'OCF/Net Income Ratio',
        value: metrics.operatingCashToNetIncome[latest]
      });
    }
    
    // Check Free Cash Flow
    if (metrics.freeCashFlow[latest] < 0) {
      alerts.push({
        type: 'warning',
        message: 'Negative free cash flow - company burning cash after investments',
        metric: 'Free Cash Flow',
        value: metrics.freeCashFlow[latest]
      });
    }
    
    // Check Capital Intensity
    if (metrics.capexToRevenue[latest] > 20) {
      alerts.push({
        type: 'info',
        message: 'High capital expenditure relative to revenue - capital intensive business',
        metric: 'CapEx/Revenue %',
        value: metrics.capexToRevenue[latest]
      });
    }
    
    // Check Operating Cash Flow trend
    if (metrics.operating[latest] < 0) {
      alerts.push({
        type: 'danger',
        message: 'Negative operating cash flow - core operations not generating cash',
        metric: 'Operating Cash Flow',
        value: metrics.operating[latest]
      });
    }
    
    return alerts;
  }
}

// Stress Testing Module
export interface StressTestScenario {
  name: string;
  description: string;
  assumptions: {
    revenueShock: number; // % change
    marginPressure: number; // basis points
    workingCapitalImpact: number; // % of revenue
    capexReduction: number; // % change
  };
}

export interface StressTestResult {
  scenario: StressTestScenario;
  impactedMetrics: {
    revenue: number;
    operatingCashFlow: number;
    freeCashFlow: number;
    workingCapital: number;
    liquidityRatio: number;
  };
  survivalAnalysis: {
    monthsOfCashRemaining: number;
    breakEvenPoint: number;
    recoveryTimeMonths: number;
  };
  recommendations: string[];
}

export class StressTestingEngine {
  private baselineData: Record<string, number[]>;
  
  constructor(data: Record<string, number[]>) {
    this.baselineData = data;
  }

  runStressTest(scenario: StressTestScenario): StressTestResult {
    const latestPeriod = this.baselineData['Revenue'].length - 1;
    const baseRevenue = this.baselineData['Revenue'][latestPeriod];
    const baseOCF = this.baselineData['Cash Flow from Operations'][latestPeriod];
    const baseCash = this.baselineData['Cash'][latestPeriod] || baseOCF * 2; // Estimate if not provided
    
    // Apply stress scenario
    const stressedRevenue = baseRevenue * (1 + scenario.assumptions.revenueShock / 100);
    const marginImpact = scenario.assumptions.marginPressure / 10000; // Convert bps to decimal
    const stressedOCF = baseOCF * (1 + scenario.assumptions.revenueShock / 100) * (1 - marginImpact);
    
    // Working capital impact
    const wcImpact = stressedRevenue * (scenario.assumptions.workingCapitalImpact / 100);
    
    // CapEx adjustment
    const baseCapex = Math.abs(baseOCF * 0.3); // Estimate if not provided
    const stressedCapex = baseCapex * (1 + scenario.assumptions.capexReduction / 100);
    
    // Calculate stressed free cash flow
    const stressedFCF = stressedOCF - stressedCapex - wcImpact;
    
    // Survival analysis
    const monthlyBurn = stressedFCF < 0 ? Math.abs(stressedFCF) / 12 : 0;
    const monthsOfCash = monthlyBurn > 0 ? baseCash / monthlyBurn : 999;
    
    // Break-even analysis
    const breakEvenRevenue = baseRevenue * 0.7; // Simplified assumption
    const revenueGapPercent = ((breakEvenRevenue - stressedRevenue) / stressedRevenue) * 100;
    
    // Recovery time (simplified model)
    const recoveryMonths = Math.max(6, Math.abs(scenario.assumptions.revenueShock) / 2);
    
    // Generate recommendations
    const recommendations = this.generateStressTestRecommendations(scenario, {
      monthsOfCash,
      stressedFCF,
      revenueGapPercent
    });
    
    return {
      scenario,
      impactedMetrics: {
        revenue: stressedRevenue,
        operatingCashFlow: stressedOCF,
        freeCashFlow: stressedFCF,
        workingCapital: wcImpact,
        liquidityRatio: baseCash / (Math.abs(stressedFCF) / 12 || 1)
      },
      survivalAnalysis: {
        monthsOfCashRemaining: monthsOfCash,
        breakEvenPoint: revenueGapPercent,
        recoveryTimeMonths: recoveryMonths
      },
      recommendations
    };
  }

  getStandardScenarios(): StressTestScenario[] {
    return [
      {
        name: 'Mild Recession',
        description: '15% revenue decline with margin pressure',
        assumptions: {
          revenueShock: -15,
          marginPressure: 200, // 2% margin pressure
          workingCapitalImpact: 2,
          capexReduction: -20
        }
      },
      {
        name: 'Severe Recession',
        description: '30% revenue decline with significant cost pressures',
        assumptions: {
          revenueShock: -30,
          marginPressure: 400, // 4% margin pressure
          workingCapitalImpact: 5,
          capexReduction: -50
        }
      },
      {
        name: 'Industry Disruption',
        description: '25% revenue loss with increased competition',
        assumptions: {
          revenueShock: -25,
          marginPressure: 300,
          workingCapitalImpact: 3,
          capexReduction: -10 // May need to invest more
        }
      },
      {
        name: 'Supply Chain Crisis',
        description: '10% revenue loss with major cost increases',
        assumptions: {
          revenueShock: -10,
          marginPressure: 500, // 5% margin pressure
          workingCapitalImpact: 8, // Higher inventory costs
          capexReduction: -30
        }
      }
    ];
  }

  private generateStressTestRecommendations(
    scenario: StressTestScenario, 
    results: { monthsOfCash: number; stressedFCF: number; revenueGapPercent: number }
  ): string[] {
    const recommendations: string[] = [];
    
    if (results.monthsOfCash < 6) {
      recommendations.push('URGENT: Secure additional financing or credit facilities immediately');
      recommendations.push('Implement aggressive cost reduction measures');
      recommendations.push('Consider asset sales or divestments to raise cash');
    } else if (results.monthsOfCash < 12) {
      recommendations.push('Establish backup credit facilities as precautionary measure');
      recommendations.push('Review and optimize working capital management');
    }
    
    if (results.stressedFCF < 0) {
      recommendations.push('Reduce capital expenditures to preserve cash');
      recommendations.push('Negotiate extended payment terms with suppliers');
      recommendations.push('Accelerate collection of receivables');
    }
    
    if (scenario.assumptions.revenueShock < -20) {
      recommendations.push('Develop contingency plans for further revenue declines');
      recommendations.push('Diversify revenue streams to reduce concentration risk');
      recommendations.push('Consider strategic partnerships or mergers');
    }
    
    // Scenario-specific recommendations
    if (scenario.name.includes('Recession')) {
      recommendations.push('Focus on maintaining market share during downturn');
      recommendations.push('Prepare for recovery phase with strategic investments');
    }
    
    if (scenario.name.includes('Disruption')) {
      recommendations.push('Accelerate digital transformation initiatives');
      recommendations.push('Invest in innovation to stay competitive');
    }
    
    return recommendations;
  }
}

// Export utility functions
export const generateCashFlowInsights = (metrics: CashFlowMetrics): string[] => {
  const insights: string[] = [];
  const latest = metrics.operatingCashToNetIncome.length - 1;
  
  // OCF Quality
  if (metrics.operatingCashToNetIncome[latest] > 120) {
    insights.push('Strong cash conversion - operating cash flow exceeds reported earnings');
  } else if (metrics.operatingCashToNetIncome[latest] < 80) {
    insights.push('Potential earnings quality concerns - low cash conversion ratio');
  }
  
  // Free Cash Flow
  if (metrics.freeCashFlow[latest] > 0 && metrics.fcfGrowthRate[latest] > 10) {
    insights.push('Healthy free cash flow generation with strong growth trajectory');
  }
  
  // Capital Efficiency
  if (metrics.capexToRevenue[latest] < 5) {
    insights.push('Asset-light business model with low capital requirements');
  } else if (metrics.capexToRevenue[latest] > 15) {
    insights.push('Capital-intensive operations requiring significant ongoing investment');
  }
  
  return insights;
}; 