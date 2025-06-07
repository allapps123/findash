// Multi-company Portfolio Analysis Module for FinDash Phase 3
// Advanced analytics for comparing and managing multiple companies

export interface CompanyData {
  id: string;
  name: string;
  industry: string;
  marketCap?: number;
  financialData: Record<string, number[]>;
  lastUpdated: Date;
}

export interface PortfolioMetrics {
  // Risk Metrics
  portfolioVolatility: number;
  correlationMatrix: Record<string, Record<string, number>>;
  diversificationRatio: number;
  concentrationRisk: number;
  
  // Performance Metrics
  weightedAverageROE: number;
  weightedAverageROA: number;
  portfolioGrowthRate: number;
  riskAdjustedReturn: number;
  
  // Comparative Analysis
  topPerformers: {
    company: string;
    metric: string;
    value: number;
    rank: number;
  }[];
  
  underperformers: {
    company: string;
    issue: string;
    severity: 'high' | 'medium' | 'low';
    recommendation: string;
  }[];
  
  // Industry Analysis
  industryBreakdown: Record<string, {
    count: number;
    weightedValue: number;
    avgMetrics: Record<string, number>;
  }>;
  
  // ESG and Sustainability (placeholder for future)
  esgScores?: Record<string, number>;
  sustainabilityRank?: Record<string, number>;
}

export interface BenchmarkingResult {
  company: string;
  metrics: {
    [key: string]: {
      value: number;
      percentile: number;
      industryAverage: number;
      bestInClass: number;
      gap: number;
      trend: 'improving' | 'declining' | 'stable';
    };
  };
  overallRank: number;
  totalCompanies: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface TrendAnalysis {
  metric: string;
  companies: Record<string, {
    values: number[];
    trend: 'upward' | 'downward' | 'sideways';
    volatility: number;
    forecast: number[];
    confidence: number;
  }>;
  industryTrend: {
    average: number[];
    median: number[];
    topQuartile: number[];
    bottomQuartile: number[];
  };
}

export class PortfolioAnalyzer {
  private companies: CompanyData[];
  
  constructor(companies: CompanyData[]) {
    this.companies = companies;
  }

  analyzePortfolio(): PortfolioMetrics {
    const metrics = this.calculateBasicMetrics();
    const riskMetrics = this.calculateRiskMetrics();
    const performanceMetrics = this.calculatePerformanceMetrics();
    const comparativeAnalysis = this.performComparativeAnalysis();
    const industryAnalysis = this.analyzeIndustryBreakdown();
    
    return {
      ...riskMetrics,
      ...performanceMetrics,
      ...comparativeAnalysis,
      industryBreakdown: industryAnalysis
    };
  }

  benchmarkCompanies(): BenchmarkingResult[] {
    return this.companies.map(company => this.benchmarkSingleCompany(company));
  }

  analyzeTrends(metrics: string[]): TrendAnalysis[] {
    return metrics.map(metric => this.analyzeSingleTrend(metric));
  }

  generatePortfolioInsights(): string[] {
    const insights: string[] = [];
    const portfolioMetrics = this.analyzePortfolio();
    
    // Risk Assessment
    if (portfolioMetrics.concentrationRisk > 0.5) {
      insights.push('Portfolio shows high concentration risk - consider diversifying across more companies/industries');
    }
    
    if (portfolioMetrics.diversificationRatio < 0.7) {
      insights.push('Limited diversification benefits - companies may be highly correlated');
    }
    
    // Performance Analysis
    if (portfolioMetrics.weightedAverageROE > 15) {
      insights.push('Strong portfolio ROE performance indicates effective capital allocation');
    }
    
    if (portfolioMetrics.riskAdjustedReturn > 1.5) {
      insights.push('Excellent risk-adjusted returns - portfolio generating value above risk taken');
    }
    
    // Industry Insights
    const industries = Object.keys(portfolioMetrics.industryBreakdown);
    if (industries.length < 3) {
      insights.push('Consider expanding into additional industries for better risk distribution');
    }
    
    return insights;
  }

  private calculateBasicMetrics() {
    // Calculate basic portfolio metrics
    return this.companies.reduce((acc, company) => {
      const latestRevenue = this.getLatestValue(company.financialData['Revenue'] || []);
      const latestNetIncome = this.getLatestValue(company.financialData['Net Income'] || []);
      
      acc.totalRevenue = (acc.totalRevenue || 0) + latestRevenue;
      acc.totalNetIncome = (acc.totalNetIncome || 0) + latestNetIncome;
      
      return acc;
    }, {} as any);
  }

  private calculateRiskMetrics() {
    // Calculate portfolio risk metrics
    const correlations = this.calculateCorrelationMatrix();
    const volatilities = this.calculateVolatilities();
    
    const portfolioVolatility = this.calculatePortfolioVolatility(volatilities, correlations);
    const diversificationRatio = this.calculateDiversificationRatio(volatilities, portfolioVolatility);
    const concentrationRisk = this.calculateConcentrationRisk();
    
    return {
      portfolioVolatility,
      correlationMatrix: correlations,
      diversificationRatio,
      concentrationRisk
    };
  }

  private calculatePerformanceMetrics() {
    let totalWeight = 0;
    let weightedROE = 0;
    let weightedROA = 0;
    let weightedGrowth = 0;
    
    this.companies.forEach(company => {
      const weight = this.getCompanyWeight(company);
      const roe = this.calculateROE(company);
      const roa = this.calculateROA(company);
      const growth = this.calculateGrowthRate(company.financialData['Revenue'] || []);
      
      totalWeight += weight;
      weightedROE += roe * weight;
      weightedROA += roa * weight;
      weightedGrowth += growth * weight;
    });
    
    return {
      weightedAverageROE: weightedROE / totalWeight,
      weightedAverageROA: weightedROA / totalWeight,
      portfolioGrowthRate: weightedGrowth / totalWeight,
      riskAdjustedReturn: (weightedROE / totalWeight) / this.calculatePortfolioRisk()
    };
  }

  private performComparativeAnalysis() {
    const topPerformers = this.identifyTopPerformers();
    const underperformers = this.identifyUnderperformers();
    
    return { topPerformers, underperformers };
  }

  private analyzeIndustryBreakdown() {
    const breakdown: Record<string, any> = {};
    
    this.companies.forEach(company => {
      if (!breakdown[company.industry]) {
        breakdown[company.industry] = {
          count: 0,
          weightedValue: 0,
          avgMetrics: {}
        };
      }
      
      breakdown[company.industry].count++;
      breakdown[company.industry].weightedValue += this.getCompanyWeight(company);
    });
    
    return breakdown;
  }

  private benchmarkSingleCompany(company: CompanyData): BenchmarkingResult {
    const metrics = this.getCompanyMetrics(company);
    const industryPeers = this.companies.filter(c => c.industry === company.industry && c.id !== company.id);
    
    const benchmarkedMetrics: any = {};
    
    Object.keys(metrics).forEach(metricKey => {
      const value = metrics[metricKey];
      const peerValues = industryPeers.map(peer => this.getCompanyMetrics(peer)[metricKey]).filter(v => v !== undefined);
      
      if (peerValues.length > 0) {
        const sorted = peerValues.sort((a, b) => b - a); // Descending order
        const percentile = this.calculatePercentile(value, sorted);
        const industryAverage = peerValues.reduce((sum, v) => sum + v, 0) / peerValues.length;
        const bestInClass = Math.max(...peerValues);
        
        benchmarkedMetrics[metricKey] = {
          value,
          percentile,
          industryAverage,
          bestInClass,
          gap: bestInClass - value,
          trend: this.calculateTrend(company.financialData[metricKey] || [])
        };
      }
    });
    
    return {
      company: company.name,
      metrics: benchmarkedMetrics,
      overallRank: this.calculateOverallRank(company),
      totalCompanies: this.companies.length,
      strengthAreas: this.identifyStrengths(benchmarkedMetrics),
      improvementAreas: this.identifyImprovements(benchmarkedMetrics)
    };
  }

  private analyzeSingleTrend(metric: string): TrendAnalysis {
    const companies: Record<string, any> = {};
    
    this.companies.forEach(company => {
      const values = company.financialData[metric] || [];
      if (values.length >= 2) {
        companies[company.name] = {
          values,
          trend: this.calculateTrend(values),
          volatility: this.calculateVolatility(values),
          forecast: this.generateForecast(values),
          confidence: this.calculateForecastConfidence(values)
        };
      }
    });
    
    const industryTrend = this.calculateIndustryTrend(metric);
    
    return {
      metric,
      companies,
      industryTrend
    };
  }

  // Utility methods
  private getLatestValue(values: number[]): number {
    return values.length > 0 ? values[values.length - 1] : 0;
  }

  private getCompanyWeight(company: CompanyData): number {
    // Simple equal weighting for now
    return 1 / this.companies.length;
  }

  private calculateROE(company: CompanyData): number {
    const netIncome = this.getLatestValue(company.financialData['Net Income'] || []);
    const equity = this.getLatestValue(company.financialData['Shareholders Equity'] || []);
    return equity > 0 ? (netIncome / equity) * 100 : 0;
  }

  private calculateROA(company: CompanyData): number {
    const netIncome = this.getLatestValue(company.financialData['Net Income'] || []);
    const assets = this.getLatestValue(company.financialData['Total Assets'] || []);
    return assets > 0 ? (netIncome / assets) * 100 : 0;
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    const periods = values.length - 1;
    return first > 0 ? (Math.pow(last / first, 1 / periods) - 1) * 100 : 0;
  }

  private calculateCorrelationMatrix(): Record<string, Record<string, number>> {
    // Simplified correlation calculation
    const matrix: Record<string, Record<string, number>> = {};
    
    this.companies.forEach(company1 => {
      matrix[company1.name] = {};
      this.companies.forEach(company2 => {
        if (company1.id === company2.id) {
          matrix[company1.name][company2.name] = 1.0;
        } else {
          // Calculate correlation between revenue growth rates
          const correlation = this.calculateCorrelation(
            company1.financialData['Revenue'] || [],
            company2.financialData['Revenue'] || []
          );
          matrix[company1.name][company2.name] = correlation;
        }
      });
    });
    
    return matrix;
  }

  private calculateCorrelation(values1: number[], values2: number[]): number {
    if (values1.length !== values2.length || values1.length < 2) return 0;
    
    const mean1 = values1.reduce((sum, v) => sum + v, 0) / values1.length;
    const mean2 = values2.reduce((sum, v) => sum + v, 0) / values2.length;
    
    let numerator = 0;
    let sumSq1 = 0;
    let sumSq2 = 0;
    
    for (let i = 0; i < values1.length; i++) {
      const diff1 = values1[i] - mean1;
      const diff2 = values2[i] - mean2;
      numerator += diff1 * diff2;
      sumSq1 += diff1 * diff1;
      sumSq2 += diff2 * diff2;
    }
    
    const denominator = Math.sqrt(sumSq1 * sumSq2);
    return denominator > 0 ? numerator / denominator : 0;
  }

  private calculateVolatilities(): Record<string, number> {
    const volatilities: Record<string, number> = {};
    
    this.companies.forEach(company => {
      const returns = this.calculateReturns(company.financialData['Revenue'] || []);
      volatilities[company.name] = this.calculateVolatility(returns);
    });
    
    return volatilities;
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateReturns(values: number[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        returns.push((values[i] - values[i - 1]) / values[i - 1]);
      }
    }
    return returns;
  }

  private calculatePortfolioVolatility(volatilities: Record<string, number>, correlations: Record<string, Record<string, number>>): number {
    // Simplified portfolio volatility calculation
    const companies = Object.keys(volatilities);
    const n = companies.length;
    const weight = 1 / n; // Equal weighting
    
    let portfolioVariance = 0;
    
    companies.forEach(company1 => {
      companies.forEach(company2 => {
        const correlation = correlations[company1]?.[company2] || 0;
        portfolioVariance += weight * weight * volatilities[company1] * volatilities[company2] * correlation;
      });
    });
    
    return Math.sqrt(portfolioVariance);
  }

  private calculateDiversificationRatio(volatilities: Record<string, number>, portfolioVolatility: number): number {
    const avgVolatility = Object.values(volatilities).reduce((sum, v) => sum + v, 0) / Object.values(volatilities).length;
    return portfolioVolatility > 0 ? avgVolatility / portfolioVolatility : 0;
  }

  private calculateConcentrationRisk(): number {
    // Calculate based on company size distribution
    const weights = this.companies.map(company => this.getCompanyWeight(company));
    const herfindahlIndex = weights.reduce((sum, weight) => sum + weight * weight, 0);
    return herfindahlIndex;
  }

  private calculatePortfolioRisk(): number {
    // Simplified risk calculation
    return this.calculateConcentrationRisk() + (1 - this.calculateDiversificationRatio({}, 0.1));
  }

  private identifyTopPerformers() {
    const performers: any[] = [];
    
    this.companies.forEach(company => {
      const roe = this.calculateROE(company);
      const growth = this.calculateGrowthRate(company.financialData['Revenue'] || []);
      
      if (roe > 20) {
        performers.push({
          company: company.name,
          metric: 'ROE',
          value: roe,
          rank: 1
        });
      }
      
      if (growth > 15) {
        performers.push({
          company: company.name,
          metric: 'Revenue Growth',
          value: growth,
          rank: 1
        });
      }
    });
    
    return performers.sort((a, b) => b.value - a.value).slice(0, 5);
  }

  private identifyUnderperformers() {
    const underperformers: any[] = [];
    
    this.companies.forEach(company => {
      const roe = this.calculateROE(company);
      const roa = this.calculateROA(company);
      
      if (roe < 5) {
        underperformers.push({
          company: company.name,
          issue: 'Low Return on Equity',
          severity: 'high' as const,
          recommendation: 'Review capital allocation and operational efficiency'
        });
      }
      
      if (roa < 3) {
        underperformers.push({
          company: company.name,
          issue: 'Poor Asset Utilization',
          severity: 'medium' as const,
          recommendation: 'Optimize asset turnover and margin improvement'
        });
      }
    });
    
    return underperformers;
  }

  private getCompanyMetrics(company: CompanyData): Record<string, number> {
    return {
      'ROE': this.calculateROE(company),
      'ROA': this.calculateROA(company),
      'Revenue Growth': this.calculateGrowthRate(company.financialData['Revenue'] || []),
      'Net Margin': this.calculateNetMargin(company),
      'Asset Turnover': this.calculateAssetTurnover(company)
    };
  }

  private calculateNetMargin(company: CompanyData): number {
    const revenue = this.getLatestValue(company.financialData['Revenue'] || []);
    const netIncome = this.getLatestValue(company.financialData['Net Income'] || []);
    return revenue > 0 ? (netIncome / revenue) * 100 : 0;
  }

  private calculateAssetTurnover(company: CompanyData): number {
    const revenue = this.getLatestValue(company.financialData['Revenue'] || []);
    const assets = this.getLatestValue(company.financialData['Total Assets'] || []);
    return assets > 0 ? revenue / assets : 0;
  }

  private calculatePercentile(value: number, sortedValues: number[]): number {
    const rank = sortedValues.findIndex(v => v <= value);
    return rank >= 0 ? ((sortedValues.length - rank) / sortedValues.length) * 100 : 0;
  }

  private calculateTrend(values: number[]): 'upward' | 'downward' | 'sideways' {
    if (values.length < 2) return 'sideways';
    
    const first = values[0];
    const last = values[values.length - 1];
    const change = (last - first) / first;
    
    if (change > 0.05) return 'upward';
    if (change < -0.05) return 'downward';
    return 'sideways';
  }

  private calculateOverallRank(company: CompanyData): number {
    // Simplified ranking based on multiple metrics
    const metrics = this.getCompanyMetrics(company);
    const score = Object.values(metrics).reduce((sum, value) => sum + value, 0);
    
    const allScores = this.companies.map(c => {
      const m = this.getCompanyMetrics(c);
      return Object.values(m).reduce((sum, value) => sum + value, 0);
    }).sort((a, b) => b - a);
    
    return allScores.findIndex(s => s <= score) + 1;
  }

  private identifyStrengths(metrics: any): string[] {
    const strengths: string[] = [];
    
    Object.keys(metrics).forEach(key => {
      if (metrics[key].percentile >= 75) {
        strengths.push(key);
      }
    });
    
    return strengths;
  }

  private identifyImprovements(metrics: any): string[] {
    const improvements: string[] = [];
    
    Object.keys(metrics).forEach(key => {
      if (metrics[key].percentile <= 25) {
        improvements.push(key);
      }
    });
    
    return improvements;
  }

  private generateForecast(values: number[]): number[] {
    // Simple linear trend forecast
    if (values.length < 2) return [];
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    // Calculate slope and intercept
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate forecast for next 2 periods
    return [
      slope * n + intercept,
      slope * (n + 1) + intercept
    ];
  }

  private calculateForecastConfidence(values: number[]): number {
    // Simple confidence measure based on data consistency
    if (values.length < 3) return 0.5;
    
    const volatility = this.calculateVolatility(values);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const coefficientOfVariation = mean > 0 ? volatility / mean : 1;
    
    // Higher volatility = lower confidence
    return Math.max(0.3, Math.min(0.9, 1 - coefficientOfVariation));
  }

  private calculateIndustryTrend(metric: string) {
    const allValues: number[][] = [];
    
    this.companies.forEach(company => {
      const values = company.financialData[metric];
      if (values && values.length > 0) {
        allValues.push(values);
      }
    });
    
    if (allValues.length === 0) {
      return {
        average: [],
        median: [],
        topQuartile: [],
        bottomQuartile: []
      };
    }
    
    const maxLength = Math.max(...allValues.map(arr => arr.length));
    const periods = Array.from({ length: maxLength }, (_, i) => i);
    
    return {
      average: periods.map(i => this.calculateAverageAtPeriod(allValues, i)),
      median: periods.map(i => this.calculateMedianAtPeriod(allValues, i)),
      topQuartile: periods.map(i => this.calculateQuartileAtPeriod(allValues, i, 0.75)),
      bottomQuartile: periods.map(i => this.calculateQuartileAtPeriod(allValues, i, 0.25))
    };
  }

  private calculateAverageAtPeriod(allValues: number[][], period: number): number {
    const validValues = allValues
      .map(values => values[period])
      .filter(value => value !== undefined);
    
    return validValues.length > 0 
      ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length 
      : 0;
  }

  private calculateMedianAtPeriod(allValues: number[][], period: number): number {
    const validValues = allValues
      .map(values => values[period])
      .filter(value => value !== undefined)
      .sort((a, b) => a - b);
    
    if (validValues.length === 0) return 0;
    
    const mid = Math.floor(validValues.length / 2);
    return validValues.length % 2 === 0 
      ? (validValues[mid - 1] + validValues[mid]) / 2 
      : validValues[mid];
  }

  private calculateQuartileAtPeriod(allValues: number[][], period: number, percentile: number): number {
    const validValues = allValues
      .map(values => values[period])
      .filter(value => value !== undefined)
      .sort((a, b) => a - b);
    
    if (validValues.length === 0) return 0;
    
    const index = Math.floor(validValues.length * percentile);
    return validValues[Math.min(index, validValues.length - 1)];
  }
}

// Export utility functions
export const createSamplePortfolio = (): CompanyData[] => {
  return [
    {
      id: 'company-1',
      name: 'Tech Innovations Inc.',
      industry: 'Technology',
      marketCap: 50000000000,
      financialData: {
        'Revenue': [10000000, 12000000, 15000000, 18000000, 22000000],
        'Net Income': [1000000, 1500000, 2000000, 2500000, 3200000],
        'Total Assets': [25000000, 28000000, 32000000, 38000000, 45000000],
        'Total Liabilities': [8000000, 9000000, 10000000, 12000000, 14000000],
        'Shareholders Equity': [17000000, 19000000, 22000000, 26000000, 31000000]
      },
      lastUpdated: new Date()
    },
    {
      id: 'company-2',
      name: 'Manufacturing Corp.',
      industry: 'Manufacturing',
      marketCap: 25000000000,
      financialData: {
        'Revenue': [20000000, 21000000, 22500000, 24000000, 25500000],
        'Net Income': [1500000, 1600000, 1800000, 2000000, 2200000],
        'Total Assets': [40000000, 42000000, 45000000, 48000000, 52000000],
        'Total Liabilities': [15000000, 16000000, 17000000, 18000000, 19000000],
        'Shareholders Equity': [25000000, 26000000, 28000000, 30000000, 33000000]
      },
      lastUpdated: new Date()
    }
  ];
}; 