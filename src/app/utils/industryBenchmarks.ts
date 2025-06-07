// Industry Benchmarks and Peer Comparison Module for FinDash
// Provides industry-specific benchmarks for financial ratio analysis

export interface IndustryBenchmark {
  industry: string;
  sector: string;
  ratios: {
    grossMargin: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
    netMargin: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
    roe: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
    roa: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
    debtToEquity: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
    currentRatio: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
    assetTurnover: { 
      excellent: number; 
      good: number; 
      average: number; 
      poor: number; 
    };
  };
  description: string;
  marketSize: string;
  keyMetrics: string[];
}

export interface BenchmarkComparison {
  metric: string;
  companyValue: number;
  industryBenchmark: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  performance: 'excellent' | 'good' | 'average' | 'poor';
  percentile: number;
  insight: string;
}

export interface PeerComparisonResult {
  selectedIndustry: string;
  companyMetrics: Record<string, number>;
  comparisons: BenchmarkComparison[];
  overallScore: number;
  overallRating: 'excellent' | 'good' | 'average' | 'poor';
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

// Industry benchmark data based on real market research
export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    industry: "Technology - Software",
    sector: "Technology",
    ratios: {
      grossMargin: { excellent: 85, good: 75, average: 65, poor: 50 },
      netMargin: { excellent: 25, good: 18, average: 12, poor: 5 },
      roe: { excellent: 25, good: 18, average: 12, poor: 6 },
      roa: { excellent: 15, good: 10, average: 6, poor: 3 },
      debtToEquity: { excellent: 0.3, good: 0.5, average: 0.8, poor: 1.5 },
      currentRatio: { excellent: 3.0, good: 2.5, average: 2.0, poor: 1.2 },
      assetTurnover: { excellent: 1.5, good: 1.2, average: 0.9, poor: 0.6 }
    },
    description: "High-margin software companies with scalable business models",
    marketSize: "$500B+ globally",
    keyMetrics: ["Recurring Revenue", "Customer Acquisition Cost", "Churn Rate"]
  },
  {
    industry: "Retail - E-commerce",
    sector: "Consumer Discretionary",
    ratios: {
      grossMargin: { excellent: 50, good: 40, average: 30, poor: 20 },
      netMargin: { excellent: 15, good: 10, average: 6, poor: 2 },
      roe: { excellent: 20, good: 15, average: 10, poor: 5 },
      roa: { excellent: 12, good: 8, average: 5, poor: 2 },
      debtToEquity: { excellent: 0.4, good: 0.7, average: 1.0, poor: 1.8 },
      currentRatio: { excellent: 2.5, good: 2.0, average: 1.5, poor: 1.0 },
      assetTurnover: { excellent: 2.5, good: 2.0, average: 1.5, poor: 1.0 }
    },
    description: "Online retail with focus on inventory management and logistics",
    marketSize: "$4.2T globally",
    keyMetrics: ["Conversion Rate", "Average Order Value", "Inventory Turnover"]
  },
  {
    industry: "Manufacturing - Industrial",
    sector: "Industrials",
    ratios: {
      grossMargin: { excellent: 40, good: 30, average: 25, poor: 15 },
      netMargin: { excellent: 12, good: 8, average: 5, poor: 2 },
      roe: { excellent: 18, good: 12, average: 8, poor: 4 },
      roa: { excellent: 10, good: 7, average: 4, poor: 2 },
      debtToEquity: { excellent: 0.5, good: 0.8, average: 1.2, poor: 2.0 },
      currentRatio: { excellent: 2.0, good: 1.5, average: 1.2, poor: 0.9 },
      assetTurnover: { excellent: 1.8, good: 1.4, average: 1.0, poor: 0.7 }
    },
    description: "Asset-heavy manufacturing with longer business cycles",
    marketSize: "$2.3T globally",
    keyMetrics: ["Capacity Utilization", "Working Capital", "CAPEX/Revenue"]
  },
  {
    industry: "Financial Services - Banking",
    sector: "Financials",
    ratios: {
      grossMargin: { excellent: 70, good: 60, average: 50, poor: 35 },
      netMargin: { excellent: 30, good: 22, average: 15, poor: 8 },
      roe: { excellent: 15, good: 12, average: 9, poor: 5 },
      roa: { excellent: 1.5, good: 1.2, average: 0.9, poor: 0.5 },
      debtToEquity: { excellent: 8.0, good: 10.0, average: 12.0, poor: 16.0 },
      currentRatio: { excellent: 1.2, good: 1.1, average: 1.0, poor: 0.9 },
      assetTurnover: { excellent: 0.15, good: 0.12, average: 0.09, poor: 0.06 }
    },
    description: "Traditional banking with regulatory capital requirements",
    marketSize: "$130T globally",
    keyMetrics: ["Net Interest Margin", "Loan Loss Provisions", "Tier 1 Capital"]
  },
  {
    industry: "Healthcare - Pharmaceuticals",
    sector: "Healthcare",
    ratios: {
      grossMargin: { excellent: 80, good: 70, average: 60, poor: 45 },
      netMargin: { excellent: 25, good: 18, average: 12, poor: 6 },
      roe: { excellent: 20, good: 15, average: 10, poor: 5 },
      roa: { excellent: 12, good: 8, average: 5, poor: 2 },
      debtToEquity: { excellent: 0.3, good: 0.5, average: 0.8, poor: 1.3 },
      currentRatio: { excellent: 3.5, good: 2.8, average: 2.2, poor: 1.5 },
      assetTurnover: { excellent: 1.0, good: 0.8, average: 0.6, poor: 0.4 }
    },
    description: "R&D intensive with high regulatory barriers and IP protection",
    marketSize: "$1.4T globally",
    keyMetrics: ["R&D Spend", "Pipeline Value", "Patent Expiry"]
  },
  {
    industry: "Energy - Oil & Gas",
    sector: "Energy",
    ratios: {
      grossMargin: { excellent: 35, good: 25, average: 18, poor: 10 },
      netMargin: { excellent: 15, good: 10, average: 6, poor: 2 },
      roe: { excellent: 16, good: 12, average: 8, poor: 3 },
      roa: { excellent: 8, good: 6, average: 4, poor: 1 },
      debtToEquity: { excellent: 0.4, good: 0.7, average: 1.1, poor: 2.0 },
      currentRatio: { excellent: 1.8, good: 1.4, average: 1.1, poor: 0.8 },
      assetTurnover: { excellent: 1.2, good: 0.9, average: 0.7, poor: 0.4 }
    },
    description: "Commodity-driven with high capital requirements and volatility",
    marketSize: "$4.5T globally",
    keyMetrics: ["Production Cost", "Reserves", "CAPEX Efficiency"]
  },
  {
    industry: "Real Estate - REITs",
    sector: "Real Estate",
    ratios: {
      grossMargin: { excellent: 70, good: 60, average: 50, poor: 35 },
      netMargin: { excellent: 45, good: 35, average: 25, poor: 15 },
      roe: { excellent: 12, good: 9, average: 6, poor: 3 },
      roa: { excellent: 6, good: 4, average: 3, poor: 1 },
      debtToEquity: { excellent: 1.0, good: 1.5, average: 2.0, poor: 3.0 },
      currentRatio: { excellent: 1.5, good: 1.2, average: 1.0, poor: 0.7 },
      assetTurnover: { excellent: 0.25, good: 0.20, average: 0.15, poor: 0.10 }
    },
    description: "Income-focused with high leverage and asset appreciation",
    marketSize: "$3.7T globally",
    keyMetrics: ["FFO", "Occupancy Rate", "Net Asset Value"]
  },
  {
    industry: "Consumer Goods - FMCG",
    sector: "Consumer Staples",
    ratios: {
      grossMargin: { excellent: 45, good: 35, average: 28, poor: 20 },
      netMargin: { excellent: 12, good: 8, average: 5, poor: 2 },
      roe: { excellent: 18, good: 14, average: 10, poor: 6 },
      roa: { excellent: 8, good: 6, average: 4, poor: 2 },
      debtToEquity: { excellent: 0.5, good: 0.8, average: 1.2, poor: 2.0 },
      currentRatio: { excellent: 2.0, good: 1.6, average: 1.3, poor: 1.0 },
      assetTurnover: { excellent: 2.0, good: 1.6, average: 1.2, poor: 0.8 }
    },
    description: "Stable demand with brand strength and distribution networks",
    marketSize: "$15T globally",
    keyMetrics: ["Market Share", "Brand Value", "Distribution Reach"]
  }
];

export class PeerComparisonAnalyzer {
  private industryBenchmarks: IndustryBenchmark[];

  constructor() {
    this.industryBenchmarks = INDUSTRY_BENCHMARKS;
  }

  getAvailableIndustries(): { value: string; label: string; sector: string }[] {
    return this.industryBenchmarks.map(benchmark => ({
      value: benchmark.industry,
      label: benchmark.industry,
      sector: benchmark.sector
    }));
  }

  performComparison(
    industry: string,
    companyMetrics: {
      grossMargin: number;
      netMargin: number;
      roe: number;
      roa: number;
      debtToEquity: number;
      currentRatio?: number;
      assetTurnover: number;
    }
  ): PeerComparisonResult {
    const benchmark = this.industryBenchmarks.find(b => b.industry === industry);
    
    if (!benchmark) {
      throw new Error(`Industry benchmark not found: ${industry}`);
    }

    const comparisons: BenchmarkComparison[] = [];
    let totalScore = 0;
    let metricCount = 0;

    // Compare each metric
    Object.entries(companyMetrics).forEach(([metric, value]) => {
      if (value === undefined || value === null) return;
      
      const benchmarkData = (benchmark.ratios as any)[metric];
      if (!benchmarkData) return;

      const comparison = this.compareMetric(metric, value, benchmarkData);
      comparisons.push(comparison);
      
      // Calculate score (0-100 scale)
      const score = this.calculateMetricScore(value, benchmarkData, metric);
      totalScore += score;
      metricCount++;
    });

    const overallScore = metricCount > 0 ? totalScore / metricCount : 0;
    const overallRating = this.getOverallRating(overallScore);

    const result: PeerComparisonResult = {
      selectedIndustry: industry,
      companyMetrics,
      comparisons,
      overallScore,
      overallRating,
      recommendations: this.generateRecommendations(comparisons, benchmark),
      strengths: this.identifyStrengths(comparisons),
      weaknesses: this.identifyWeaknesses(comparisons)
    };

    return result;
  }

  private compareMetric(
    metric: string,
    value: number,
    benchmark: { excellent: number; good: number; average: number; poor: number }
  ): BenchmarkComparison {
    let performance: 'excellent' | 'good' | 'average' | 'poor';
    let percentile: number;
    let insight: string;

    // Determine performance rating based on metric type
    const isInverseMetric = metric === 'debtToEquity'; // Lower is better for debt ratios
    
    if (isInverseMetric) {
      if (value <= benchmark.excellent) {
        performance = 'excellent';
        percentile = 90;
      } else if (value <= benchmark.good) {
        performance = 'good';
        percentile = 75;
      } else if (value <= benchmark.average) {
        performance = 'average';
        percentile = 50;
      } else {
        performance = 'poor';
        percentile = 25;
      }
    } else {
      if (value >= benchmark.excellent) {
        performance = 'excellent';
        percentile = 90;
      } else if (value >= benchmark.good) {
        performance = 'good';
        percentile = 75;
      } else if (value >= benchmark.average) {
        performance = 'average';
        percentile = 50;
      } else {
        performance = 'poor';
        percentile = 25;
      }
    }

    // Generate insights based on performance
    insight = this.generateMetricInsight(metric, performance, value, benchmark);

    return {
      metric,
      companyValue: value,
      industryBenchmark: benchmark,
      performance,
      percentile,
      insight
    };
  }

  private calculateMetricScore(
    value: number,
    benchmark: { excellent: number; good: number; average: number; poor: number },
    metric: string
  ): number {
    const isInverseMetric = metric === 'debtToEquity';
    
    if (isInverseMetric) {
      if (value <= benchmark.excellent) return 100;
      if (value <= benchmark.good) return 80;
      if (value <= benchmark.average) return 60;
      if (value <= benchmark.poor) return 40;
      return 20;
    } else {
      if (value >= benchmark.excellent) return 100;
      if (value >= benchmark.good) return 80;
      if (value >= benchmark.average) return 60;
      if (value >= benchmark.poor) return 40;
      return 20;
    }
  }

  private getOverallRating(score: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'average';
    return 'poor';
  }

  private generateMetricInsight(
    metric: string,
    performance: string,
    value: number,
    benchmark: { excellent: number; good: number; average: number; poor: number }
  ): string {
    const metricNames: Record<string, string> = {
      grossMargin: 'Gross Margin',
      netMargin: 'Net Margin', 
      roe: 'Return on Equity',
      roa: 'Return on Assets',
      debtToEquity: 'Debt-to-Equity Ratio',
      currentRatio: 'Current Ratio',
      assetTurnover: 'Asset Turnover'
    };

    const metricName = metricNames[metric] || metric;
    const isPercentage = metric.includes('Margin') || metric.includes('roe') || metric.includes('roa');
    const valueStr = isPercentage ? `${value.toFixed(2)}%` : value.toFixed(2);
    const benchmarkStr = isPercentage ? `${benchmark.excellent.toFixed(2)}%` : benchmark.excellent.toFixed(2);

    switch (performance) {
      case 'excellent':
        return `${metricName} of ${valueStr} significantly outperforms industry average. This represents top-tier performance.`;
      case 'good':
        return `${metricName} of ${valueStr} is above industry average, indicating strong performance.`;
      case 'average':
        return `${metricName} of ${valueStr} is in line with industry standards.`;
      case 'poor':
        return `${metricName} of ${valueStr} is below industry average. Consider strategies to improve to ${benchmarkStr} (excellent level).`;
      default:
        return `${metricName}: ${valueStr}`;
    }
  }

  private generateRecommendations(comparisons: BenchmarkComparison[], benchmark: IndustryBenchmark): string[] {
    const recommendations: string[] = [];
    
    // Industry-specific recommendations
    recommendations.push(`Focus on ${benchmark.keyMetrics.join(', ')} as key performance indicators for ${benchmark.industry}.`);
    
    // Metric-specific recommendations
    const poorMetrics = comparisons.filter(c => c.performance === 'poor');
    const averageMetrics = comparisons.filter(c => c.performance === 'average');
    
    if (poorMetrics.length > 0) {
      recommendations.push(`Priority improvement needed in: ${poorMetrics.map(m => m.metric).join(', ')}.`);
    }
    
    if (averageMetrics.length > 0) {
      recommendations.push(`Consider enhancing: ${averageMetrics.map(m => m.metric).join(', ')} to achieve competitive advantage.`);
    }

    // Add specific strategic recommendations based on industry
    if (benchmark.industry.includes('Technology')) {
      recommendations.push('Invest in R&D and customer acquisition to drive scalable growth.');
      recommendations.push('Focus on recurring revenue models and customer lifetime value optimization.');
    } else if (benchmark.industry.includes('Manufacturing')) {
      recommendations.push('Optimize operational efficiency and supply chain management.');
      recommendations.push('Invest in automation and process improvements to improve margins.');
    } else if (benchmark.industry.includes('Retail')) {
      recommendations.push('Focus on inventory turnover and supply chain optimization.');
      recommendations.push('Invest in digital transformation and customer experience.');
    }

    return recommendations.slice(0, 6); // Limit to 6 recommendations
  }

  private identifyStrengths(comparisons: BenchmarkComparison[]): string[] {
    const excellentMetrics = comparisons.filter(c => c.performance === 'excellent');
    const goodMetrics = comparisons.filter(c => c.performance === 'good');
    
    const strengths: string[] = [];
    
    excellentMetrics.forEach(metric => {
      strengths.push(`Exceptional ${metric.metric} performance (${metric.percentile}th percentile)`);
    });
    
    goodMetrics.forEach(metric => {
      strengths.push(`Strong ${metric.metric} compared to peers`);
    });
    
    return strengths.slice(0, 5); // Limit to top 5 strengths
  }

  private identifyWeaknesses(comparisons: BenchmarkComparison[]): string[] {
    const poorMetrics = comparisons.filter(c => c.performance === 'poor');
    const averageMetrics = comparisons.filter(c => c.performance === 'average');
    
    const weaknesses: string[] = [];
    
    poorMetrics.forEach(metric => {
      weaknesses.push(`${metric.metric} significantly below industry standards`);
    });
    
    averageMetrics.forEach(metric => {
      weaknesses.push(`${metric.metric} has room for improvement vs. top performers`);
    });
    
    return weaknesses.slice(0, 5); // Limit to top 5 weaknesses
  }
}

// Export utility function
export function createPeerComparison(
  industry: string,
  companyMetrics: {
    grossMargin: number;
    netMargin: number;
    roe: number;
    roa: number;
    debtToEquity: number;
    currentRatio?: number;
    assetTurnover: number;
  }
): PeerComparisonResult {
  const analyzer = new PeerComparisonAnalyzer();
  return analyzer.performComparison(industry, companyMetrics);
} 