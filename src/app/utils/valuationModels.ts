// Valuation Models Module for FinDash
// Provides DCF, P/E multiple analysis, and comparable company analysis

export interface DCFInputs {
  initialCashFlow: number;
  projectionYears: number;
  revenueGrowthRates: number[]; // Array of growth rates for each year
  terminalGrowthRate: number;
  discountRate: number; // WACC
  netDebt: number;
  sharesOutstanding: number;
  // Optional detailed inputs
  capitalExpenditures?: number[];
  workingCapitalChanges?: number[];
  taxRate?: number;
  ebitdaMargins?: number[];
}

export interface DCFResult {
  projectedCashFlows: number[];
  presentValues: number[];
  terminalValue: number;
  terminalValuePV: number;
  enterpriseValue: number;
  equityValue: number;
  valuePerShare: number;
  sensitivityAnalysis: {
    growthRates: number[];
    discountRates: number[];
    valuationMatrix: number[][];
  };
  summary: {
    totalPV: number;
    terminalValuePercent: number;
    impliedMultiple: number;
  };
}

export interface ComparableCompany {
  name: string;
  marketCap: number;
  revenue: number;
  ebitda: number;
  netIncome: number;
  bookValue: number;
  peRatio: number;
  evEbitdaRatio: number;
  priceToBookRatio: number;
  sector: string;
}

export interface ValuationComparison {
  targetMetrics: {
    revenue: number;
    ebitda: number;
    netIncome: number;
    bookValue: number;
  };
  peerMultiples: {
    avgPE: number;
    medianPE: number;
    avgEVEbitda: number;
    medianEVEbitda: number;
    avgPriceToBook: number;
    medianPriceToBook: number;
  };
  impliedValuations: {
    peValuation: number;
    evEbitdaValuation: number;
    priceToBookValuation: number;
    averageValuation: number;
  };
  analysis: {
    multiples: ComparableCompany[];
    outliers: string[];
    recommendations: string[];
  };
}

export interface ValuationSummary {
  dcfValuation?: DCFResult;
  comparableValuation?: ValuationComparison;
  recommendations: string[];
  riskFactors: string[];
  keyAssumptions: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

export class DCFModel {
  constructor() {}

  calculate(inputs: DCFInputs): DCFResult {
    const { 
      initialCashFlow, 
      projectionYears, 
      revenueGrowthRates, 
      terminalGrowthRate, 
      discountRate,
      netDebt,
      sharesOutstanding
    } = inputs;

    // Project cash flows
    const projectedCashFlows: number[] = [];
    let currentCashFlow = initialCashFlow;

    for (let i = 0; i < projectionYears; i++) {
      const growthRate = revenueGrowthRates[i] || revenueGrowthRates[revenueGrowthRates.length - 1];
      currentCashFlow = currentCashFlow * (1 + growthRate / 100);
      projectedCashFlows.push(currentCashFlow);
    }

    // Calculate present values
    const presentValues = projectedCashFlows.map((cf, index) => {
      return cf / Math.pow(1 + discountRate / 100, index + 1);
    });

    // Terminal value calculation
    const finalCashFlow = projectedCashFlows[projectedCashFlows.length - 1];
    const terminalCashFlow = finalCashFlow * (1 + terminalGrowthRate / 100);
    const terminalValue = terminalCashFlow / (discountRate / 100 - terminalGrowthRate / 100);
    const terminalValuePV = terminalValue / Math.pow(1 + discountRate / 100, projectionYears);

    // Enterprise and equity value
    const totalPV = presentValues.reduce((sum, pv) => sum + pv, 0);
    const enterpriseValue = totalPV + terminalValuePV;
    const equityValue = enterpriseValue - netDebt;
    const valuePerShare = equityValue / sharesOutstanding;

    // Sensitivity analysis
    const sensitivityAnalysis = this.performSensitivityAnalysis(inputs, finalCashFlow, projectionYears);

    // Summary calculations
    const terminalValuePercent = (terminalValuePV / enterpriseValue) * 100;
    const impliedMultiple = enterpriseValue / initialCashFlow;

    return {
      projectedCashFlows,
      presentValues,
      terminalValue,
      terminalValuePV,
      enterpriseValue,
      equityValue,
      valuePerShare,
      sensitivityAnalysis,
      summary: {
        totalPV,
        terminalValuePercent,
        impliedMultiple
      }
    };
  }

  private performSensitivityAnalysis(
    inputs: DCFInputs, 
    finalCashFlow: number, 
    projectionYears: number
  ): DCFResult['sensitivityAnalysis'] {
    const growthRates = [
      inputs.terminalGrowthRate - 1,
      inputs.terminalGrowthRate - 0.5,
      inputs.terminalGrowthRate,
      inputs.terminalGrowthRate + 0.5,
      inputs.terminalGrowthRate + 1
    ];

    const discountRates = [
      inputs.discountRate - 1,
      inputs.discountRate - 0.5,
      inputs.discountRate,
      inputs.discountRate + 0.5,
      inputs.discountRate + 1
    ];

    const valuationMatrix: number[][] = [];

    for (const growthRate of growthRates) {
      const row: number[] = [];
      for (const discountRate of discountRates) {
        const terminalCashFlow = finalCashFlow * (1 + growthRate / 100);
        const terminalValue = terminalCashFlow / (discountRate / 100 - growthRate / 100);
        const terminalValuePV = terminalValue / Math.pow(1 + discountRate / 100, projectionYears);
        
        // Simplified calculation for sensitivity
        const totalPV = inputs.initialCashFlow / (discountRate / 100) * (1 - 1 / Math.pow(1 + discountRate / 100, projectionYears));
        const enterpriseValue = totalPV + terminalValuePV;
        const equityValue = enterpriseValue - inputs.netDebt;
        const valuePerShare = equityValue / inputs.sharesOutstanding;
        
        row.push(valuePerShare);
      }
      valuationMatrix.push(row);
    }

    return {
      growthRates,
      discountRates,
      valuationMatrix
    };
  }
}

export class ComparableAnalysis {
  private sampleComparables: Record<string, ComparableCompany[]> = {
    "Technology - Software": [
      {
        name: "Microsoft Corporation",
        marketCap: 2800000000000,
        revenue: 211915000000,
        ebitda: 89035000000,
        netIncome: 72361000000,
        bookValue: 206223000000,
        peRatio: 28.5,
        evEbitdaRatio: 25.2,
        priceToBookRatio: 12.8,
        sector: "Technology"
      },
      {
        name: "Salesforce Inc",
        marketCap: 245000000000,
        revenue: 31352000000,
        ebitda: 5654000000,
        netIncome: 4136000000,
        bookValue: 24739000000,
        peRatio: 44.2,
        evEbitdaRatio: 35.8,
        priceToBookRatio: 8.2,
        sector: "Technology"
      },
      {
        name: "Adobe Inc",
        marketCap: 240000000000,
        revenue: 19408000000,
        ebitda: 7875000000,
        netIncome: 5594000000,
        bookValue: 24018000000,
        peRatio: 35.6,
        evEbitdaRatio: 28.9,
        priceToBookRatio: 9.8,
        sector: "Technology"
      }
    ],
    "Retail - E-commerce": [
      {
        name: "Amazon.com Inc",
        marketCap: 1650000000000,
        revenue: 574785000000,
        ebitda: 71654000000,
        netIncome: 30425000000,
        bookValue: 201876000000,
        peRatio: 45.2,
        evEbitdaRatio: 23.8,
        priceToBookRatio: 7.9,
        sector: "Consumer Discretionary"
      },
      {
        name: "Shopify Inc",
        marketCap: 95000000000,
        revenue: 7063000000,
        ebitda: 789000000,
        netIncome: 2866000000,
        bookValue: 8456000000,
        peRatio: 28.4,
        evEbitdaRatio: 89.5,
        priceToBookRatio: 10.2,
        sector: "Consumer Discretionary"
      }
    ],
    "Manufacturing - Industrial": [
      {
        name: "General Electric",
        marketCap: 180000000000,
        revenue: 74196000000,
        ebitda: 9876000000,
        netIncome: 5465000000,
        bookValue: 56432000000,
        peRatio: 25.8,
        evEbitdaRatio: 18.2,
        priceToBookRatio: 2.8,
        sector: "Industrials"
      },
      {
        name: "Caterpillar Inc",
        marketCap: 160000000000,
        revenue: 67060000000,
        ebitda: 12890000000,
        netIncome: 6705000000,
        bookValue: 23187000000,
        peRatio: 16.8,
        evEbitdaRatio: 12.4,
        priceToBookRatio: 6.2,
        sector: "Industrials"
      }
    ]
  };

  analyzeComparables(
    industry: string,
    targetMetrics: ValuationComparison['targetMetrics']
  ): ValuationComparison {
    const comparables = this.sampleComparables[industry] || this.sampleComparables["Technology - Software"];
    
    // Calculate peer multiples
    const peRatios = comparables.map(c => c.peRatio).filter(pe => pe > 0 && pe < 100);
    const evEbitdaRatios = comparables.map(c => c.evEbitdaRatio).filter(ev => ev > 0 && ev < 100);
    const priceToBookRatios = comparables.map(c => c.priceToBookRatio).filter(pb => pb > 0 && pb < 50);

    const peerMultiples = {
      avgPE: this.average(peRatios),
      medianPE: this.median(peRatios),
      avgEVEbitda: this.average(evEbitdaRatios),
      medianEVEbitda: this.median(evEbitdaRatios),
      avgPriceToBook: this.average(priceToBookRatios),
      medianPriceToBook: this.median(priceToBookRatios)
    };

    // Calculate implied valuations
    const impliedValuations = {
      peValuation: targetMetrics.netIncome * peerMultiples.avgPE,
      evEbitdaValuation: targetMetrics.ebitda * peerMultiples.avgEVEbitda,
      priceToBookValuation: targetMetrics.bookValue * peerMultiples.avgPriceToBook,
      averageValuation: 0
    };

    impliedValuations.averageValuation = (
      impliedValuations.peValuation + 
      impliedValuations.evEbitdaValuation + 
      impliedValuations.priceToBookValuation
    ) / 3;

    // Generate analysis
    const outliers = this.identifyOutliers(comparables);
    const recommendations = this.generateRecommendations(peerMultiples, targetMetrics);

    return {
      targetMetrics,
      peerMultiples,
      impliedValuations,
      analysis: {
        multiples: comparables,
        outliers,
        recommendations
      }
    };
  }

  private average(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
  }

  private median(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private identifyOutliers(comparables: ComparableCompany[]): string[] {
    const outliers: string[] = [];
    
    comparables.forEach(company => {
      if (company.peRatio > 60 || company.peRatio < 5) {
        outliers.push(`${company.name} - Extreme P/E ratio (${company.peRatio.toFixed(1)})`);
      }
      if (company.evEbitdaRatio > 50 || company.evEbitdaRatio < 5) {
        outliers.push(`${company.name} - Unusual EV/EBITDA (${company.evEbitdaRatio.toFixed(1)})`);
      }
    });

    return outliers;
  }

  private generateRecommendations(
    multiples: ValuationComparison['peerMultiples'],
    targetMetrics: ValuationComparison['targetMetrics']
  ): string[] {
    const recommendations: string[] = [];

    if (multiples.avgPE > 30) {
      recommendations.push("High P/E multiples suggest growth expectations - ensure company can deliver");
    }
    
    if (multiples.avgEVEbitda < 15) {
      recommendations.push("Low EV/EBITDA multiples may indicate value opportunity or sector headwinds");
    }

    if (targetMetrics.ebitda / targetMetrics.revenue < 0.1) {
      recommendations.push("Consider margin improvement initiatives to justify peer multiples");
    }

    recommendations.push("Use median multiples for more conservative estimates due to outlier sensitivity");
    recommendations.push("Consider company-specific factors that may warrant premium/discount to peers");

    return recommendations;
  }
}

export class ValuationAnalyzer {
  private dcfModel: DCFModel;
  private comparableAnalysis: ComparableAnalysis;

  constructor() {
    this.dcfModel = new DCFModel();
    this.comparableAnalysis = new ComparableAnalysis();
  }

  performCompleteValuation(
    dcfInputs?: DCFInputs,
    industry?: string,
    targetMetrics?: ValuationComparison['targetMetrics']
  ): ValuationSummary {
    const results: ValuationSummary = {
      recommendations: [],
      riskFactors: [],
      keyAssumptions: [],
      confidenceLevel: 'medium'
    };

    // DCF Analysis
    if (dcfInputs) {
      results.dcfValuation = this.dcfModel.calculate(dcfInputs);
      results.keyAssumptions.push(
        `Terminal growth rate: ${dcfInputs.terminalGrowthRate}%`,
        `Discount rate (WACC): ${dcfInputs.discountRate}%`,
        `Projection period: ${dcfInputs.projectionYears} years`
      );
    }

    // Comparable Analysis
    if (industry && targetMetrics) {
      results.comparableValuation = this.comparableAnalysis.analyzeComparables(industry, targetMetrics);
    }

    // Generate combined recommendations
    results.recommendations = this.generateCombinedRecommendations(results);
    results.riskFactors = this.identifyRiskFactors(results);
    results.confidenceLevel = this.assessConfidenceLevel(results);

    return results;
  }

  private generateCombinedRecommendations(results: ValuationSummary): string[] {
    const recommendations: string[] = [];

    if (results.dcfValuation && results.comparableValuation) {
      const dcfValue = results.dcfValuation.valuePerShare;
      const compValue = results.comparableValuation.impliedValuations.averageValuation;
      const variance = Math.abs(dcfValue - compValue) / ((dcfValue + compValue) / 2) * 100;

      if (variance > 30) {
        recommendations.push("Significant variance between DCF and comparable analysis - review assumptions");
      } else {
        recommendations.push("DCF and comparable analysis show reasonable alignment - good validation");
      }
    }

    if (results.dcfValuation) {
      if (results.dcfValuation.summary.terminalValuePercent > 75) {
        recommendations.push("High terminal value dependency - consider extending projection period");
      }
      recommendations.push("Perform sensitivity analysis on key value drivers");
    }

    recommendations.push("Consider industry cycles and company-specific factors");
    recommendations.push("Update valuation regularly as new information becomes available");

    return recommendations;
  }

  private identifyRiskFactors(results: ValuationSummary): string[] {
    const risks: string[] = [];

    if (results.dcfValuation) {
      if (results.dcfValuation.summary.terminalValuePercent > 70) {
        risks.push("High terminal value dependency increases forecast uncertainty");
      }
    }

    if (results.comparableValuation) {
      if (results.comparableValuation.analysis.outliers.length > 0) {
        risks.push("Peer group contains outliers that may skew multiples");
      }
    }

    risks.push("Market conditions and investor sentiment can impact multiples");
    risks.push("Company execution risk on growth and margin assumptions");
    risks.push("Regulatory and competitive landscape changes");

    return risks;
  }

  private assessConfidenceLevel(results: ValuationSummary): 'high' | 'medium' | 'low' {
    let score = 0;

    if (results.dcfValuation && results.comparableValuation) {
      score += 2; // Both methods available
    } else if (results.dcfValuation || results.comparableValuation) {
      score += 1; // One method available
    }

    if (results.dcfValuation && results.dcfValuation.summary.terminalValuePercent < 60) {
      score += 1; // Lower terminal value dependency
    }

    if (results.comparableValuation && results.comparableValuation.analysis.outliers.length === 0) {
      score += 1; // Clean peer group
    }

    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }
}

// Export utility functions
export function createDCFAnalysis(inputs: DCFInputs): DCFResult {
  const model = new DCFModel();
  return model.calculate(inputs);
}

export function createComparableAnalysis(
  industry: string,
  targetMetrics: ValuationComparison['targetMetrics']
): ValuationComparison {
  const analysis = new ComparableAnalysis();
  return analysis.analyzeComparables(industry, targetMetrics);
}

export function performCompleteValuation(
  dcfInputs?: DCFInputs,
  industry?: string,
  targetMetrics?: ValuationComparison['targetMetrics']
): ValuationSummary {
  const analyzer = new ValuationAnalyzer();
  return analyzer.performCompleteValuation(dcfInputs, industry, targetMetrics);
} 