# 📊 FinDash - Financial Analysis Dashboard

FinDash is a comprehensive full-stack financial analysis platform that transforms raw financial data into actionable insights. Built with Next.js 15, React 19, and TypeScript, deployed on Netlify with serverless functions for scalable performance.

## 🎯 **What makes FinDash unique?**
- **🚀 One-Command Setup**: `netlify dev` starts both frontend and API backend
- **🤖 Smart Data Processing**: Auto-detects financial statement formats in multiple languages
- **📈 Real-time Analysis**: Instant calculation of 20+ financial ratios with interactive charts
- **📄 Professional Reports**: Generate publication-ready PDF reports with custom branding
- **🌐 Full-Stack Ready**: Seamless integration with 15+ external APIs and services

## 🚀 Features

### MVP Capabilities (Weeks 1-4)

#### 📊 Data Upload & Processing
- **Smart Upload Engine**: Support for Excel (.xlsx, .xls) and CSV files up to 10MB
- **Auto-Mapping Intelligence**: Automatically detects and maps 10+ financial statement line items
- **Multi-Language Support**: Recognition of English and Vietnamese financial terms
- **Drag & Drop Interface**: Intuitive file upload with real-time validation
- **Sample Template**: Download sample financial data template

#### 🔍 Financial Analysis Engine
- **20+ Financial Ratios**: Comprehensive ratio analysis including:
  - Profitability ratios (Gross Margin, Net Margin, ROA, ROE)
  - Leverage ratios (Debt-to-Equity, Debt-to-Assets, Equity Multiplier)
  - Efficiency ratios (Asset Turnover, Inventory Turnover)
- **DuPont Decomposition**: Break down ROE into its component drivers
- **Quality Assessment**: Earnings quality and growth trend analysis
- **Red Flag Detection**: Automated alert system for financial risks

#### 📈 Interactive Dashboard
- **Multi-Tab Interface**: Overview, Ratios, DuPont Analysis, and Forecasting
- **Dynamic Visualizations**: Interactive charts with Recharts
- **Responsive Design**: Mobile-friendly with dark mode support
- **Real-time Updates**: Live calculation updates as data changes

#### 🔮 Forecasting Module
- **12-Month Projections**: Quick scenario modeling
- **Interactive Assumptions**: Adjustable growth rates and margin assumptions
- **Scenario Analysis**: Compare different business scenarios
- **Visual Forecasts**: Chart-based forecast presentations

#### 📄 Professional PDF Export ⭐ **NEW**
- **Comprehensive Reports**: Multi-page PDF generation with executive summary
- **Customizable Sections**: Choose which analysis sections to include
- **Chart Integration**: Automatic capture of dashboard visualizations
- **Professional Layout**: Branded headers, formatted tables, and clean design
- **Export Options**: Company branding and custom report titles

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts for interactive data visualization
- **Icons**: Heroicons with consistent design language
- **Animations**: Framer Motion for smooth interactions
- **File Processing**: SheetJS (xlsx) for Excel/CSV parsing
- **PDF Export**: jsPDF + html2canvas for professional report generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with JavaScript enabled
- Netlify CLI (for full-stack development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fin-dash.git
   cd fin-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   # Recommended: Full-stack development with Netlify
   netlify dev
   # or
   npm run netlify:dev
   
   # Alternative: Next.js only
   npm run dev
   ```

4. **Open your browser**
   - **Netlify Dev**: [http://localhost:8888](http://localhost:8888) (recommended)
   - **Next.js Dev**: [http://localhost:3000](http://localhost:3000)

## 📋 Usage Guide

### 1. Upload Financial Data
- Click or drag financial statements (Excel/CSV) onto the upload area
- Maximum file size: 10MB
- Supported formats: .xlsx, .xls, .csv
- Download the sample template for reference

### 2. Map Your Data
- **Auto-mapping**: The system automatically detects standard financial line items
- **Manual mapping**: If auto-mapping fails, manually map columns to financial categories
- **Required fields**: Revenue, COGS, Net Income, Total Assets, Total Liabilities, Shareholders Equity
- **Optional fields**: Gross Profit, SG&A, EBITDA, Cash Flow from Operations

### 3. Analyze Results
- **Overview**: Revenue trends and profitability analysis
- **Ratios**: Comprehensive financial ratio breakdown
- **DuPont**: ROE decomposition and driver analysis
- **Forecast**: Interactive 12-month projections

### 4. Export Professional Reports ⭐
- Click **"Export Report"** in the dashboard header
- Customize company information and report title
- Select which sections to include:
  - ✅ **Ratio Analysis**: Financial ratio tables and trends
  - ✅ **DuPont Analysis**: ROE breakdown and performance drivers
  - ✅ **Charts & Visualizations**: High-resolution chart captures
  - ✅ **Financial Projections**: Forward-looking insights
- Generate and download professional PDF reports

## 🏗️ Architecture

### Component Structure
```
src/
├── app/
│   ├── components/
│   │   ├── UploadForm.tsx       # File upload and validation
│   │   ├── MappingDialog.tsx    # Column mapping interface
│   │   ├── ResultPanel.tsx      # Main dashboard display
│   │   ├── PDFExportDialog.tsx  # PDF export customization
│   │   └── Layout components
│   ├── utils/
│   │   ├── financialAnalysis.ts # Core analysis engine
│   │   └── pdfExport.ts         # PDF generation utility
│   └── page.tsx                 # Main application page
├── public/
│   └── sample-financial-data.csv # Sample template
└── ...
```

### Key Classes

#### `FinancialAnalyzer`
Core analysis engine that processes financial data and calculates:
- Profitability ratios and trends
- Leverage and efficiency metrics
- DuPont decomposition
- Quality indicators and alerts
- Summary statistics

#### `PDFReportGenerator` ⭐
Professional PDF generation system featuring:
- Multi-page report layouts
- Executive summary with key metrics
- Formatted ratio analysis tables
- Chart capture and embedding
- Custom company branding

#### Main Components
- **UploadForm**: Handles file upload, validation, and parsing
- **MappingDialog**: Interactive column mapping with validation
- **ResultPanel**: Tabbed dashboard with charts and metrics
- **PDFExportDialog**: Customizable PDF report generation

## 🎯 Target Users

### Primary Users
- **Corporate Finance Analysts**: Streamline ratio analysis and reporting
- **FP&A Teams**: Quick insights for planning and forecasting
- **Investment Professionals**: Due diligence and company evaluation
- **Startup Founders**: Monitor financial health and investor metrics

### Use Cases
- **Monthly Financial Reviews**: Automated ratio tracking with PDF reports
- **Investment Analysis**: Quick company evaluation with exportable summaries
- **Board Reporting**: Professional financial summaries and presentations
- **Scenario Planning**: "What-if" analysis with comprehensive documentation

## 🚀 Roadmap

### ✅ **Phase 1: MVP Foundation** (Completed)
- [x] Excel/CSV file upload and parsing
- [x] Auto-mapping of financial statement headers
- [x] Manual mapping dialog for custom data structure
- [x] 20+ financial ratio calculations
- [x] DuPont analysis module
- [x] Interactive dashboard with multiple chart types
- [x] Quick forecasting with scenario analysis
- [x] PDF export functionality with customizable reports
- [x] **Industry peer comparison and benchmarking** ⭐ *Just Added!*

### 🔄 **Phase 2: Enhanced Analytics** (In Progress)
- [x] **Peer comparison against 8+ industry benchmarks** ✨ *Completed!*
- [x] **Valuation Models**: DCF, P/E multiple analysis, and comparable company analysis ✨ *Just Added!*
- [ ] **Cash Flow Analysis**: Operating, investing, financing cash flow breakdown
- [ ] **Working Capital Management**: Days sales outstanding, inventory turnover, payables analysis
- [ ] **Stress Testing**: Scenario modeling with Monte Carlo simulations

### 📊 **Phase 3: Business Intelligence** (Planned)
- [ ] **Multi-company Portfolio**: Compare multiple companies side-by-side
- [ ] **Time Series Analysis**: Advanced trend analysis and seasonality detection
- [ ] **Custom Metrics Builder**: Create and track custom financial metrics
- [ ] **Automated Insights**: AI-powered financial commentary and recommendations
- [ ] **Alert System**: Threshold-based notifications for key metrics

## 🔧 Troubleshooting

### Common Issues & Solutions

**🚨 "netlify dev" command not found**
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Or use npx
npx netlify dev
```

**🚨 Port 8888 already in use**
```bash
# Kill existing process
lsof -ti:8888 | xargs kill

# Or use different port
netlify dev --port 9999
```

**🚨 API routes not working**
```bash
# Check if functions are running
netlify dev --debug

# Test API endpoints
curl http://localhost:8888/api/health
```

**🚨 Environment variables not loading**
```bash
# Check Netlify site connection
netlify status

# Link to Netlify site
netlify link

# Check environment variables
netlify env:list
```

**🚨 Build failures**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules
npm install
```

### 📞 Support & Contributing

**Need Help?**
- 📚 Check the [Netlify Docs](https://docs.netlify.com/cli/get-started/)
- 🐛 [Report Issues](https://github.com/yourusername/fin-dash/issues)
- 💬 [Discussions](https://github.com/yourusername/fin-dash/discussions)

**Contributing:**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

**Built with ❤️ using Next.js 15, React 19, and Netlify Functions**

⭐ **Star this repo if FinDash helps your financial analysis workflow!**

### 🔗 **Phase 4: Integration & Collaboration** (Future)
- [ ] **API Integrations**: Connect to QuickBooks, Xero, and other accounting platforms
- [ ] **Team Collaboration**: Shared workspaces and collaborative analysis
- [ ] **Real-time Data**: Live financial data feeds and automatic updates
- [ ] **White-label Solution**: Customizable branding for consulting firms

## 📄 PDF Export Features

### **Report Customization**
- **Company Information**: Custom company name and report titles
- **Section Selection**: Choose which sections to include:
  - Executive Summary with key insights
  - Comprehensive ratio analysis tables
  - DuPont analysis breakdown
  - **Industry peer comparison** ⭐ *New!*
  - Charts and visualizations (high-resolution captures)
  - Financial projections and forecasting

### **Professional Output**
- **Multi-page Layout**: Automatic page breaks and consistent formatting
- **Chart Integration**: High-resolution Recharts captures embedded seamlessly
- **Branded Headers/Footers**: Professional document styling
- **Executive Summary**: Key metrics, growth rates, and financial health overview
- **Detailed Analysis**: Comprehensive tables and insights

### **Peer Comparison in PDFs** ⭐ *New!*
- **Industry Benchmarking**: Complete comparison against selected industry standards
- **Performance Scores**: Overall ratings and percentile rankings
- **Strategic Insights**: Automatically generated recommendations and improvement areas
- **Visual Analysis**: Included when peer comparison data is available

## 🎯 How to Use FinDash

### **Step 1: Upload Your Data**
1. Prepare your financial data in Excel (.xlsx) or CSV format
2. Drag and drop your file onto the upload area
3. FinDash automatically detects and maps common financial headers
4. Review the auto-mapping or manually adjust column mappings

### **Step 2: Analyze Your Financials**
- View comprehensive ratio analysis across multiple periods
- Explore DuPont analysis to understand ROE drivers
- Monitor red-flag alerts for potential issues
- Examine growth trends and financial health indicators

### **Step 3: Compare Against Industry Peers** ⭐ *New!*
1. Click **"Compare to Industry"** in the dashboard
2. Select your industry from 8+ available benchmarks:
   - Technology - Software
   - Retail - E-commerce  
   - Manufacturing - Industrial
   - Healthcare - Pharmaceuticals
   - Financial Services - Banking
   - Energy - Oil & Gas
   - Real Estate - REITs
   - Consumer Goods - FMCG
3. View your performance percentiles and strategic recommendations
4. Identify strengths, weaknesses, and improvement opportunities

### **Step 4: Generate Professional Reports**
1. Click **"Export Report"** to access PDF customization
2. Add company information and select report sections
3. Include peer comparison data when available
4. Download a professional, multi-page financial analysis report

### **Step 5: Forecast Future Performance**
- Access the forecasting tab for scenario planning
- Adjust growth assumptions and margin trends
- View 12-month projections with interactive controls

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [Wiki](https://github.com/yourusername/fin-dash/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/fin-dash/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/fin-dash/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons by [Heroicons](https://heroicons.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- PDF generation with [jsPDF](https://github.com/parallax/jsPDF)

---

**FinDash** - Transforming financial analysis through intelligent automation and beautiful visualizations.

## ✨ Key Features

### 📊 **Smart Data Processing**
- **Excel/CSV Upload**: Drag-and-drop file upload with validation (10MB limit)
- **Auto-Mapping Engine**: Automatically detects and maps common financial statement headers
- **Manual Mapping Dialog**: Sophisticated interface for custom column-to-financial-line mapping
- **Data Validation**: Real-time validation and error checking

### 🧮 **Advanced Financial Analysis**
- **20+ Financial Ratios**: Comprehensive ratio analysis including profitability, leverage, and efficiency metrics
- **DuPont Analysis**: ROE decomposition (Net Margin × Asset Turnover × Equity Multiplier)
- **Quality Metrics**: Earnings quality assessment and financial health indicators
- **Red-Flag Alerts**: Automatic detection of concerning financial trends
- **Growth Analysis**: Revenue CAGR and trend analysis

### 🏢 **Industry Peer Comparison** ⭐ *New!*
- **8+ Industry Benchmarks**: Compare against Technology, Healthcare, Manufacturing, Retail, and more
- **Performance Percentiles**: See where your metrics rank (excellent, good, average, poor)
- **Radar Chart Analysis**: Visual performance comparison across multiple metrics
- **Strategic Recommendations**: Industry-specific insights and improvement suggestions
- **Strengths & Weaknesses**: Automated identification of competitive advantages and areas for improvement

### 📈 **Interactive Dashboards**
- **Multiple Chart Types**: Line, bar, area, and composed charts using Recharts
- **Real-time Updates**: Charts update dynamically as data changes
- **Dark Mode Support**: Beautiful interface in both light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🔮 **Quick Forecasting**
- **Scenario Analysis**: Adjustable growth assumptions (revenue growth, margin trends)
- **12-Month Projections**: Forward-looking revenue and profit forecasts
- **Interactive Controls**: Real-time forecast adjustments with immediate visual feedback

### 📄 **Professional PDF Reports**
- **Comprehensive Reports**: Multi-page PDFs with executive summary, ratio analysis, DuPont breakdown, and peer comparison
- **Chart Integration**: High-resolution chart captures embedded in reports
- **Customizable Sections**: Choose which sections to include in your report
- **Company Branding**: Add company name and custom report titles
- **Professional Layout**: Multi-page formatting with headers, footers, and consistent styling

## 🌐 Netlify Development & Deployment

This project is fully configured for Netlify with seamless full-stack development and deployment.

### 🚀 Development Commands

```bash
# 🎯 Recommended: Full-stack development
netlify dev                # Starts frontend + backend on localhost:8888
npm run netlify:dev       # Alternative command

# 🔧 Alternative: Next.js only
npm run dev               # Next.js dev server on localhost:3000

# 📦 Production build
npm run netlify:build     # Optimized build for Netlify deployment
npm run build            # Standard Next.js build
```

### ⚙️ Configuration Details

**`netlify.toml` Features:**
- ✅ **Unified Development**: Single command runs frontend + backend
- ✅ **Port Management**: Netlify proxy (8888) → Next.js (3000)
- ✅ **API Routing**: Automatic proxy of `/api/*` routes to Next.js
- ✅ **Environment Variables**: Automatic injection from Netlify dashboard
- ✅ **CORS Headers**: Pre-configured for cross-origin requests
- ✅ **Build Optimization**: Node.js 18 with esbuild bundling

### 🛠️ API Routes & Functions

**Next.js App Router Integration:**
- `📤 /api/upload` - File upload and financial data processing
- `💚 /api/health` - Health check endpoint
- All API routes automatically work as Netlify Functions in production

### 🔐 Environment Variables

The following environment variables are supported:

**🔑 API Keys:**
- `VUE_APP_OPENAI_API_KEY` - OpenAI API integration
- `VUE_APP_GEMINI_API_KEY` - Google Gemini AI
- `VUE_APP_DEEPSEEK_API_KEY` - DeepSeek AI
- `VUE_APP_STOCK_API_KEY_FINNHUB` - Financial data
- `VUE_APP_STOCK_API_KEY_POLYGON` - Market data
- `VUE_APP_NEWS_API_KEY` - News integration
- `VUE_APP_GOOGLE_MAPS_API_KEY` - Maps integration

**🏦 Financial Services:**
- `PLAID_CLIENT_ID` & `PLAID_SECRET` - Banking integration
- `VUE_APP_COINRANKING_KEY` - Cryptocurrency data
- `VUE_APP_BINANCE_API_KEY` - Crypto trading data

**🔐 Authentication:**
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth
- `SESSION_SECRET` - Session management
- `MONGO_URI` - Database connection

**📊 External Services:**
- `VUE_APP_ALPHA_VANTAGE_API_KEY` - Stock data
- `VUE_APP_SERPER_API_KEY` - Search API
- `VUE_APP_BRAVE_SEARCH_API_KEY` - Search integration

### 🚀 Deployment

**Automatic Deployment:**
```bash
# Deploy to production
git push origin main        # Auto-deploys to Netlify

# Manual deployment
netlify deploy --prod       # Direct deployment
```

**Build Process:**
1. **Environment Injection**: All environment variables are automatically loaded
2. **Dependencies**: Node modules are cached for faster builds
3. **API Routes**: Converted to Netlify Functions automatically
4. **Static Assets**: Optimized and served from Netlify CDN
5. **Edge Functions**: Next.js API routes run on Netlify Edge

### 💡 Development Tips

**Hot Reloading:**
- Frontend changes reload instantly
- API route changes restart the function automatically
- Environment variable changes require server restart

**Debugging:**
```bash
# View detailed logs
netlify dev --debug

# Check function logs
netlify functions:list
netlify functions:invoke api-upload --payload='{"test": true}'
```

**Local Testing:**
```bash
# Test API endpoints locally
curl http://localhost:8888/api/health
curl http://localhost:8888/api/upload -X POST
```

### 🔧 Technical Architecture

**Development Stack:**
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Next.js API Routes → Netlify Functions
- **Database**: MongoDB (via MONGO_URI)
- **File Storage**: Temporary storage in `/tmp` (serverless)
- **Build Tool**: esbuild for fast bundling
- **Deployment**: Netlify Edge with global CDN
