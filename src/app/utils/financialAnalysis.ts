// Financial Analysis Engine for FinDash
// Calculates ratios, DuPont decomposition, and quality metrics

export interface FinancialData {
  [key: string]: number[];
}

export interface FinancialMetrics {
  // Basic Metrics
  revenue: number[];
  cogs: number[];
  grossProfit: number[];
  netIncome: number[];
  totalAssets: number[];
  totalLiabilities: number[];
  shareholdersEquity: number[];
  
  // Calculated Ratios
  profitabilityRatios: {
    grossMargin: number[];
    netMargin: number[];
    roa: number[];
    roe: number[];
  };
  
  liquidityRatios: {
    currentRatio: number[];
    quickRatio: number[];
  };
  
  leverageRatios: {
    debtToEquity: number[];
    debtToAssets: number[];
    equityMultiplier: number[];
  };
  
  efficiencyRatios: {
    assetTurnover: number[];
    inventoryTurnover: number[];
  };
  
  // DuPont Analysis
  dupontAnalysis: {
    roe: number[];
    netMargin: number[];
    assetTurnover: number[];
    equityMultiplier: number[];
  };
  
  // Quality Indicators
  qualityMetrics: {
    earningsQuality: string[];
    growthTrend: string[];
    financialStrength: string[];
  };
  
  // Alerts and Red Flags
  alerts: {
    type: 'warning' | 'danger' | 'info';
    message: string;
    metric: string;
    value: number;
  }[];
  
  // Summary Stats
  summary: {
    revenueCAGR: number;
    avgROE: number;
    avgROA: number;
    debtLevel: 'Low' | 'Medium' | 'High';
    overallHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  };
}

export class FinancialAnalyzer {
  private data: FinancialData;
  private periods: number;
  
  constructor(mappedData: Record<string, string>, rawData: any[][]) {
    this.data = this.processRawData(mappedData, rawData);
    this.periods = this.data.Revenue?.length || 0;
  }
  
  private processRawData(mapping: Record<string, string>, rawData: any[][]): FinancialData {
    const processed: FinancialData = {};
    
    // Find header indices based on mapping
    const headerIndices: Record<string, number> = {};
    if (rawData.length > 0) {
      const headers = rawData[0];
      Object.entries(mapping).forEach(([field, column]) => {
        const index = headers.findIndex((h: string) => h === column);
        if (index >= 0) {
          headerIndices[field] = index;
        }
      });
    }
    
    // Extract data for each mapped field
    Object.entries(headerIndices).forEach(([field, index]) => {
      processed[field] = rawData.slice(1)
        .map(row => {
          const value = row[index];
          return typeof value === 'number' ? value : parseFloat(value) || 0;
        })
        .filter(value => !isNaN(value));
    });
    
    return processed;
  }
  
  public analyze(): FinancialMetrics {
    const revenue = this.data['Revenue'] || [];
    const cogs = this.data['COGS'] || [];
    const netIncome = this.data['Net Income'] || [];
    const totalAssets = this.data['Total Assets'] || [];
    const totalLiabilities = this.data['Total Liabilities'] || [];
    const shareholdersEquity = this.data['Shareholders Equity'] || [];
    
    // Calculate derived metrics
    const grossProfit = revenue.map((r, i) => r - (cogs[i] || 0));
    
    // Profitability Ratios
    const grossMargin = revenue.map((r, i) => r > 0 ? (grossProfit[i] / r) * 100 : 0);
    const netMargin = revenue.map((r, i) => r > 0 ? (netIncome[i] / r) * 100 : 0);
    const roa = totalAssets.map((a, i) => a > 0 ? (netIncome[i] / a) * 100 : 0);
    const roe = shareholdersEquity.map((e, i) => e > 0 ? (netIncome[i] / e) * 100 : 0);
    
    // Leverage Ratios
    const debtToEquity = shareholdersEquity.map((e, i) => e > 0 ? totalLiabilities[i] / e : 0);
    const debtToAssets = totalAssets.map((a, i) => a > 0 ? totalLiabilities[i] / a : 0);
    const equityMultiplier = shareholdersEquity.map((e, i) => e > 0 ? totalAssets[i] / e : 0);
    
    // Efficiency Ratios
    const assetTurnover = totalAssets.map((a, i) => a > 0 ? revenue[i] / a : 0);
    
    // DuPont Analysis: ROE = Net Margin × Asset Turnover × Equity Multiplier
    const dupontROE = netMargin.map((nm, i) => 
      (nm / 100) * assetTurnover[i] * equityMultiplier[i] * 100
    );
    
    // Generate alerts and quality metrics
    const alerts = this.generateAlerts({
      grossMargin, netMargin, roa, roe, debtToEquity, debtToAssets
    });
    
    const qualityMetrics = this.assessQuality({
      revenue, netIncome, grossMargin, roe
    });
    
    // Calculate summary statistics
    const summary = this.calculateSummary({
      revenue, roe, roa, debtToAssets
    });
    
    return {
      revenue,
      cogs,
      grossProfit,
      netIncome,
      totalAssets,
      totalLiabilities,
      shareholdersEquity,
      
      profitabilityRatios: {
        grossMargin,
        netMargin,
        roa,
        roe
      },
      
      liquidityRatios: {
        currentRatio: [], // Would need current assets/liabilities
        quickRatio: []
      },
      
      leverageRatios: {
        debtToEquity,
        debtToAssets,
        equityMultiplier
      },
      
      efficiencyRatios: {
        assetTurnover,
        inventoryTurnover: [] // Would need inventory data
      },
      
      dupontAnalysis: {
        roe: dupontROE,
        netMargin,
        assetTurnover,
        equityMultiplier
      },
      
      qualityMetrics,
      alerts,
      summary
    };
  }
  
  private generateAlerts(ratios: any) {
    const alerts: any[] = [];
    const currentPeriod = ratios.grossMargin.length - 1;
    
    if (currentPeriod < 0) return alerts;
    
    // Gross Margin Alert
    if (ratios.grossMargin[currentPeriod] < 20) {
      alerts.push({
        type: 'danger',
        message: 'Low gross margin indicates potential pricing or cost issues',
        metric: 'Gross Margin',
        value: ratios.grossMargin[currentPeriod]
      });
    }
    
    // ROE Decline Alert
    if (currentPeriod > 0 && ratios.roe[currentPeriod] < ratios.roe[currentPeriod - 1] * 0.8) {
      alerts.push({
        type: 'warning',
        message: 'Significant decline in Return on Equity',
        metric: 'ROE',
        value: ratios.roe[currentPeriod]
      });
    }
    
    // High Debt Alert
    if (ratios.debtToAssets[currentPeriod] > 0.6) {
      alerts.push({
        type: 'warning',
        message: 'High debt-to-assets ratio may indicate financial risk',
        metric: 'Debt to Assets',
        value: ratios.debtToAssets[currentPeriod]
      });
    }
    
    // Negative Net Margin
    if (ratios.netMargin[currentPeriod] < 0) {
      alerts.push({
        type: 'danger',
        message: 'Negative net margin indicates the company is losing money',
        metric: 'Net Margin',
        value: ratios.netMargin[currentPeriod]
      });
    }
    
    return alerts;
  }
  
  private assessQuality(metrics: any) {
    const periods = metrics.revenue.length;
    
    // Earnings Quality Assessment
    const earningsQuality = metrics.netIncome.map((ni: number, i: number) => {
      const revenue = metrics.revenue[i];
      if (revenue > 0 && ni > 0) {
        const quality = (ni / revenue) > 0.05 ? 'Good' : 'Fair';
        return quality;
      }
      return 'Poor';
    });
    
    // Growth Trend Analysis
    const growthTrend = metrics.revenue.map((_: number, i: number) => {
      if (i === 0) return 'Baseline';
      const growth = (metrics.revenue[i] - metrics.revenue[i-1]) / metrics.revenue[i-1];
      if (growth > 0.1) return 'Strong Growth';
      if (growth > 0) return 'Moderate Growth';
      if (growth > -0.05) return 'Stable';
      return 'Declining';
    });
    
    // Financial Strength Assessment
    const financialStrength = metrics.roe.map((roe: number, i: number) => {
      const margin = metrics.grossMargin[i];
      if (roe > 15 && margin > 30) return 'Strong';
      if (roe > 10 && margin > 20) return 'Good';
      if (roe > 5 && margin > 10) return 'Fair';
      return 'Weak';
    });
    
    return {
      earningsQuality,
      growthTrend,
      financialStrength
    };
  }
  
  private calculateSummary(metrics: any) {
    const periods = metrics.revenue.length;
    if (periods < 2) {
      return {
        revenueCAGR: 0,
        avgROE: 0,
        avgROA: 0,
        debtLevel: 'Low' as const,
        overallHealth: 'Fair' as const
      };
    }
    
    // Revenue CAGR calculation
    const revenueCAGR = Math.pow(
      metrics.revenue[periods - 1] / metrics.revenue[0], 
      1 / (periods - 1)
    ) - 1;
    
    // Average metrics
    const avgROE = metrics.roe.reduce((sum: number, val: number) => sum + val, 0) / periods;
    const avgROA = metrics.roa.reduce((sum: number, val: number) => sum + val, 0) / periods;
    
    // Debt level assessment
    const avgDebtRatio = metrics.debtToAssets.reduce((sum: number, val: number) => sum + val, 0) / periods;
    let debtLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (avgDebtRatio > 0.4) debtLevel = 'Medium';
    if (avgDebtRatio > 0.6) debtLevel = 'High';
    
    // Overall health score
    let healthScore = 0;
    if (revenueCAGR > 0.05) healthScore += 25;
    if (avgROE > 10) healthScore += 25;
    if (avgROA > 5) healthScore += 25;
    if (debtLevel === 'Low') healthScore += 25;
    
    let overallHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
    if (healthScore >= 75) overallHealth = 'Excellent';
    else if (healthScore >= 50) overallHealth = 'Good';
    else if (healthScore >= 25) overallHealth = 'Fair';
    
    return {
      revenueCAGR: revenueCAGR * 100,
      avgROE,
      avgROA,
      debtLevel,
      overallHealth
    };
  }
}

// Quick forecast utility
export function generateQuickForecast(
  historical: FinancialMetrics,
  assumptions: {
    revenueGrowth: number;
    marginAssumption: 'maintain' | 'improve' | 'decline';
    capexGrowth: number;
  }
): FinancialMetrics['summary'] & { forecast: any } {
  const lastRevenue = historical.revenue[historical.revenue.length - 1];
  const lastMargin = historical.profitabilityRatios.netMargin[historical.profitabilityRatios.netMargin.length - 1];
  
  // Simple 12-month forecast
  const forecastRevenue = Array.from({ length: 12 }, (_, i) => 
    lastRevenue * Math.pow(1 + assumptions.revenueGrowth / 100, (i + 1) / 12)
  );
  
  let forecastMargin = lastMargin;
  if (assumptions.marginAssumption === 'improve') forecastMargin *= 1.1;
  if (assumptions.marginAssumption === 'decline') forecastMargin *= 0.9;
  
  const forecastNetIncome = forecastRevenue.map(rev => rev * (forecastMargin / 100));
  
  return {
    ...historical.summary,
    forecast: {
      revenue: forecastRevenue,
      netIncome: forecastNetIncome,
      assumptions
    }
  };
} 