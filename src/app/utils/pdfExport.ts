import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FinancialMetrics } from './financialAnalysis';
import { PeerComparisonResult } from './industryBenchmarks';

export interface PDFExportOptions {
  companyName: string;
  reportTitle: string;
  sections: {
    executive: boolean;
    ratios: boolean;
    dupont: boolean;
    charts: boolean;
    forecasting: boolean;
    peerComparison: boolean;
  };
  peerComparisonData?: PeerComparisonResult;
}

interface ReportOptions {
  companyName?: string;
  reportTitle?: string;
  sections: {
    executive: boolean;
    ratios: boolean;
    dupont: boolean;
    charts: boolean;
    forecasting: boolean;
    peerComparison: boolean;
  };
  peerComparisonData?: PeerComparisonResult;
}

export class PDFReportGenerator {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private margins = { left: 20, right: 20, top: 20, bottom: 20 };
  
  constructor() {
    this.pdf = new jsPDF();
  }

  public async generateReport(
    metrics: FinancialMetrics,
    options: ReportOptions
  ): Promise<void> {
    try {
      // Add cover page
      this.addCoverPage(options);
      this.addPageBreak();

      // Add sections based on options
      if (options.sections.executive) {
        this.addExecutiveSummary(metrics);
        this.addPageBreak();
      }

      if (options.sections.ratios) {
        this.addRatioAnalysis(metrics);
        this.addPageBreak();
      }

      if (options.sections.dupont) {
        this.addDupontAnalysis(metrics);
        this.addPageBreak();
      }

      if (options.sections.peerComparison && options.peerComparisonData) {
        this.addPeerComparisonAnalysis(options.peerComparisonData);
        this.addPageBreak();
      }

      if (options.sections.charts) {
        await this.addChartsSection();
        this.addPageBreak();
      }

      if (options.sections.forecasting) {
        this.addForecastingSection(metrics);
      }

      // Add footer to all pages
      this.addFooter();
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  public saveReport(fileName: string): void {
    this.pdf.save(`${fileName}-financial-report.pdf`);
  }

  private addReportHeader(title: string, companyName: string, fileName: string): void {
    // Company header
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margins.left, this.currentY);
    
    this.currentY += 10;
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(companyName, this.margins.left, this.currentY);
    
    this.currentY += 8;
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(100);
    this.pdf.text(`Data Source: ${fileName}`, this.margins.left, this.currentY);
    this.pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 120, this.currentY);
    
    this.currentY += 15;
    this.addHorizontalLine();
  }

  private addExecutiveSummary(metrics: FinancialMetrics): void {
    this.checkPageBreak(40);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text('Executive Summary', this.margins.left, this.currentY);
    this.currentY += 10;

    // Key metrics in a box
    const summaryY = this.currentY;
    this.pdf.setDrawColor(200);
    this.pdf.rect(this.margins.left, summaryY, 170, 35);
    
    this.currentY += 8;
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    // Summary metrics
    const summary = metrics.summary;
    this.pdf.text(`Revenue Growth (CAGR): ${summary.revenueCAGR.toFixed(2)}%`, this.margins.left + 5, this.currentY);
    this.pdf.text(`Overall Health: ${summary.overallHealth}`, 105, this.currentY);
    
    this.currentY += 8;
    this.pdf.text(`Average ROE: ${summary.avgROE.toFixed(2)}%`, this.margins.left + 5, this.currentY);
    this.pdf.text(`Debt Level: ${summary.debtLevel}`, 105, this.currentY);
    
    this.currentY += 8;
    this.pdf.text(`Average ROA: ${summary.avgROA.toFixed(2)}%`, this.margins.left + 5, this.currentY);
    
    this.currentY += 15;

    // Alerts section
    if (metrics.alerts.length > 0) {
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(200, 0, 0);
      this.pdf.text('Key Alerts', this.margins.left, this.currentY);
      this.currentY += 8;

      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      
      metrics.alerts.slice(0, 3).forEach(alert => {
        this.checkPageBreak(10);
        const alertColor: [number, number, number] = alert.type === 'danger' ? [200, 0, 0] : alert.type === 'warning' ? [200, 150, 0] : [0, 100, 200];
        this.pdf.setTextColor(alertColor[0], alertColor[1], alertColor[2]);
        this.pdf.text(`• ${alert.message} (${alert.metric}: ${alert.value.toFixed(2)}%)`, this.margins.left + 5, this.currentY);
        this.currentY += 6;
      });
    }

    this.currentY += 10;
  }

  private addRatioAnalysis(metrics: FinancialMetrics): void {
    this.checkPageBreak(60);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text('Financial Ratio Analysis', this.margins.left, this.currentY);
    this.currentY += 12;

    // Create ratio table
    this.addRatioTable(metrics);
  }

  private addRatioTable(metrics: FinancialMetrics): void {
    const ratios = [
      { name: 'Gross Margin (%)', values: metrics.profitabilityRatios.grossMargin },
      { name: 'Net Margin (%)', values: metrics.profitabilityRatios.netMargin },
      { name: 'Return on Assets (%)', values: metrics.profitabilityRatios.roa },
      { name: 'Return on Equity (%)', values: metrics.profitabilityRatios.roe },
      { name: 'Debt to Equity', values: metrics.leverageRatios.debtToEquity },
      { name: 'Debt to Assets (%)', values: metrics.leverageRatios.debtToAssets.map(v => v * 100) }
    ];

    const periods = metrics.revenue.length;
    const tableWidth = 170;
    const colWidth = tableWidth / (periods + 1);

    // Table header
    this.pdf.setFillColor(240, 240, 240);
    this.pdf.rect(this.margins.left, this.currentY, tableWidth, 8, 'F');
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Metric', this.margins.left + 2, this.currentY + 5);
    
    for (let i = 0; i < periods; i++) {
      this.pdf.text(`Period ${i + 1}`, this.margins.left + (i + 1) * colWidth + 2, this.currentY + 5);
    }
    
    this.currentY += 8;

    // Table rows
    this.pdf.setFont('helvetica', 'normal');
    ratios.forEach((ratio, index) => {
      this.checkPageBreak(8);
      
      if (index % 2 === 0) {
        this.pdf.setFillColor(250, 250, 250);
        this.pdf.rect(this.margins.left, this.currentY, tableWidth, 8, 'F');
      }
      
      this.pdf.text(ratio.name, this.margins.left + 2, this.currentY + 5);
      
      ratio.values.forEach((value, i) => {
        const displayValue = ratio.name.includes('Debt to Equity') ? value.toFixed(2) : `${value.toFixed(2)}%`;
        this.pdf.text(displayValue, this.margins.left + (i + 1) * colWidth + 2, this.currentY + 5);
      });
      
      this.currentY += 8;
    });

    this.currentY += 10;
  }

  private addDupontAnalysis(metrics: FinancialMetrics): void {
    this.checkPageBreak(40);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text('DuPont Analysis', this.margins.left, this.currentY);
    this.currentY += 10;

    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('ROE = Net Margin × Asset Turnover × Equity Multiplier', this.margins.left, this.currentY);
    this.currentY += 12;

    // DuPont breakdown table
    const dupont = metrics.dupontAnalysis;
    const periods = dupont.roe.length;
    
    for (let i = 0; i < periods; i++) {
      this.checkPageBreak(15);
      
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Period ${i + 1}:`, this.margins.left, this.currentY);
      this.currentY += 6;
      
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Net Margin: ${dupont.netMargin[i].toFixed(2)}%`, this.margins.left + 10, this.currentY);
      this.pdf.text(`Asset Turnover: ${dupont.assetTurnover[i].toFixed(2)}`, this.margins.left + 80, this.currentY);
      this.currentY += 5;
      
      this.pdf.text(`Equity Multiplier: ${dupont.equityMultiplier[i].toFixed(2)}`, this.margins.left + 10, this.currentY);
      this.pdf.text(`Calculated ROE: ${dupont.roe[i].toFixed(2)}%`, this.margins.left + 80, this.currentY);
      this.currentY += 8;
    }

    this.currentY += 5;
  }

  private async addChartsSection(): Promise<void> {
    this.checkPageBreak(40);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text('Charts and Visualizations', this.margins.left, this.currentY);
    this.currentY += 15;

    // Try to capture charts from the DOM
    try {
      const chartElements = document.querySelectorAll('.recharts-wrapper');
      
      for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
        this.checkPageBreak(80);
        
        const element = chartElements[i] as HTMLElement;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: 'white'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 150;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        this.pdf.addImage(imgData, 'PNG', this.margins.left, this.currentY, imgWidth, imgHeight);
        this.currentY += imgHeight + 10;
      }
    } catch (error) {
      console.warn('Could not capture charts:', error);
      this.pdf.setFontSize(12);
      this.pdf.text('Charts could not be captured for this report.', this.margins.left, this.currentY);
      this.currentY += 10;
    }
  }

  private addForecastingSection(metrics: FinancialMetrics): void {
    this.checkPageBreak(30);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text('Financial Projections', this.margins.left, this.currentY);
    this.currentY += 12;

    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Based on historical performance and current trends:', this.margins.left, this.currentY);
    this.currentY += 8;

    // Add forecasting insights
    const avgGrowth = metrics.summary.revenueCAGR;
    this.pdf.text(`• Historical revenue growth: ${avgGrowth.toFixed(2)}% CAGR`, this.margins.left + 5, this.currentY);
    this.currentY += 6;
    
    this.pdf.text(`• Average profitability: ${metrics.summary.avgROE.toFixed(2)}% ROE`, this.margins.left + 5, this.currentY);
    this.currentY += 6;
    
    this.pdf.text(`• Financial stability: ${metrics.summary.overallHealth} condition`, this.margins.left + 5, this.currentY);
    this.currentY += 10;
  }

  private addFooter(): void {
    const pageCount = this.pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(100);
      this.pdf.text('Generated by FinDash Financial Analysis Platform', this.margins.left, this.pageHeight - 10);
      this.pdf.text(`Page ${i} of ${pageCount}`, 160, this.pageHeight - 10);
    }
  }

  private addHorizontalLine(): void {
    this.pdf.setDrawColor(200);
    this.pdf.line(this.margins.left, this.currentY, 190, this.currentY);
    this.currentY += 5;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margins.bottom) {
      this.pdf.addPage();
      this.currentY = this.margins.top;
    }
  }

  private addCoverPage(options: ReportOptions): void {
    this.currentY = 50;
    
    // Company name and title
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text(options.companyName || 'Company Analysis', this.margins.left, this.currentY);
    this.currentY += 15;
    
    this.pdf.setFontSize(18);
    this.pdf.text(options.reportTitle || 'Financial Analysis Report', this.margins.left, this.currentY);
    this.currentY += 20;
    
    // Add generated date
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, this.margins.left, this.currentY);
  }

  private addPageBreak(): void {
    this.pdf.addPage();
    this.currentY = this.margins.top;
  }

  private addPeerComparisonAnalysis(peerComparisonData: PeerComparisonResult): void {
    this.checkPageBreak(40);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0);
    this.pdf.text('Industry Peer Comparison', this.margins.left, this.currentY);
    this.currentY += 12;

    // Overall score
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`Overall Performance Score: ${peerComparisonData.overallScore.toFixed(0)}/100 (${peerComparisonData.overallRating.toUpperCase()})`, this.margins.left, this.currentY);
    this.currentY += 8;
    
    this.pdf.text(`Industry: ${peerComparisonData.selectedIndustry}`, this.margins.left, this.currentY);
    this.currentY += 12;

    // Key comparisons
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Key Performance vs Industry:', this.margins.left, this.currentY);
    this.currentY += 8;

    peerComparisonData.comparisons.slice(0, 5).forEach((comparison) => {
      this.checkPageBreak(6);
      this.pdf.text(`• ${comparison.metric}: ${comparison.performance.toUpperCase()} (${comparison.percentile}th percentile)`, this.margins.left + 5, this.currentY);
      this.currentY += 6;
    });

    this.currentY += 10;
  }
}

// Export utility function
export async function exportFinancialReport(
  metrics: FinancialMetrics,
  fileName: string,
  options?: ReportOptions
): Promise<void> {
  const defaultOptions: ReportOptions = {
    companyName: 'Company Analysis',
    reportTitle: 'Financial Analysis Report',
    sections: {
      executive: true,
      ratios: true,
      dupont: true,
      charts: true,
      forecasting: true,
      peerComparison: false
    }
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  const generator = new PDFReportGenerator();
  await generator.generateReport(metrics, finalOptions);
  generator.saveReport(fileName);
} 