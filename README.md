# Infralyzer - AI-Powered Cloud Cost Management Platform

[![GitHub license](https://img.shields.io/github/license/jasonwu001t/infralyzer-app)](https://github.com/jasonwu001t/infralyzer-app/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue)](https://tailwindcss.com/)

A comprehensive **FinOps** (Financial Operations) platform that empowers organizations to optimize their cloud costs through AI-powered insights, advanced analytics, and intelligent automation. Built with modern React patterns and component-based architecture for scalability and maintainability.

![Infralyzer Dashboard](https://via.placeholder.com/800x400/0070f3/ffffff?text=Infralyzer+Dashboard)

## 🌟 Features

### 🤖 AI-Powered Cost Intelligence

- **Interactive AI Assistant** with real-time cost analysis
- **Smart recommendations** for immediate cost optimizations
- **Predictive analytics** for future cost trends
- **Automated anomaly detection** and alerting

### 📊 Comprehensive Dashboard

- **Real-time KPI monitoring** with trend analysis
- **FinOps Maturity Assessment** and scoring
- **Multi-cloud cost visualization** across AWS, Azure, GCP
- **Advanced filtering** and time-based comparisons

### 💰 Advanced Cost Analytics

- **Multi-dimensional cost analysis** (List, Billed, Contracted, Effective)
- **Rate optimization insights** with discount analysis
- **Commitment tracking** (Reserved Instances, Savings Plans)
- **Resource utilization monitoring**

### 🔍 SQL Lab & Query Builder

- **Interactive SQL editor** with syntax highlighting and validation
- **AI-powered query generation** for AWS Cost and Usage Reports
- **Pre-built templates** for common cost analysis scenarios
- **Query history** and result export capabilities
- **Modular component architecture** with separate AI assistant, templates, and results components

### 📈 Instance Rate Card

- **Real-time AWS EC2 pricing** comparison tool
- **Multi-region pricing** analysis
- **Instance family comparisons** and recommendations
- **Cost-performance optimization** suggestions

### 🏗️ Cloud Capacity Management

- **Resource capacity planning** with predictive modeling
- **Performance vs. cost** analysis
- **Rightsizing recommendations** based on usage patterns
- **Scaling optimization** strategies

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (tested with v24.5.0)
- **npm** 7+ (tested with v11.5.1)
- **Git**
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jasonwu001t/infralyzer-app.git
   cd infralyzer-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 15.2.4 with App Router
- **UI Library**: React 19 with TypeScript 5
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui components
- **State Management**: React hooks, context API, and component-based data fetching
- **Charts**: Recharts for data visualization
- **Component Architecture**: Modular, reusable components with API patterns

### Backend Integration

- **API Routes**: Next.js API routes for frontend-backend communication
- **Data Engine**: Integration with `de-polars` Python analytics engine
- **Pricing APIs**: AWS Pricing API integration
- **Authentication**: Simple localStorage-based auth (demo)

### Key Components

```
app/
├── (app)/                    # Protected app routes
│   ├── dashboard/           # Main dashboard with comprehensive KPIs
│   ├── cost-analytics/      # Advanced cost analysis and breakdown
│   ├── sql-lab/            # Modular SQL editor with AI assistant
│   ├── instance-rate-card/ # AWS pricing comparison (public)
│   ├── capacity/           # Cloud capacity management
│   ├── ai-insights/        # AI-powered cost intelligence
│   ├── optimization/       # Cost optimization recommendations
│   ├── allocation/         # Cost allocation and chargeback
│   ├── discounts/          # Savings plans and RI management
│   └── components/         # Shared UI components with API patterns
├── api/                     # API routes (primarily AWS pricing)
├── lib/                     # Utilities, hooks, and type definitions
│   ├── hooks/              # Custom React hooks
│   ├── auth/               # Authentication and user management
│   └── types/              # TypeScript interfaces
└── components/             # shadcn/ui components
```

### Component Architecture

The application follows a **component-based architecture** with smart data fetching patterns:

- **Modular Components**: Each feature is built as reusable components with clear responsibilities
- **API Patterns**: Components manage their own data fetching with user-aware demo data
- **Filter Management**: Smart filter system using React Context for cross-component state
- **Type Safety**: Full TypeScript coverage with proper interfaces and type definitions
- **Performance**: Optimized with caching, loading states, and smart re-rendering

#### Key Components

- **SQL Lab Modules**: `sql-ai-assistant.tsx`, `sql-templates.tsx`, `sql-query-editor.tsx`, `sql-query-results.tsx`, `sql-query-history.tsx`
- **Dashboard Components**: `kpi-card.tsx`, `spend-summary-chart.tsx`, `service-costs-table.tsx`, `account-costs-table.tsx`
- **Analytics Components**: `anomaly-feed.tsx`, `optimization-potential.tsx`, `forecast-accuracy.tsx`, `commitment-expirations.tsx`
- **Shared Components**: `dashboard-filters.tsx`, `ai-insights-modal.tsx`, and 30+ other specialized components

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_NAME=Infralyzer
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Integration (Optional)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
FINOPS_S3_BUCKET=your-s3-bucket
AWS_REGION=us-east-1

# Features
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

## 📚 Usage

### 1. Dashboard Overview

- View key cost metrics and trends
- Access AI-powered insights and recommendations
- Monitor FinOps maturity across different capabilities
- Apply advanced filters for detailed analysis

### 2. Cost Analytics

- Analyze costs across different dimensions
- Compare rates and discount effectiveness
- Track commitment utilization
- Identify optimization opportunities

### 3. SQL Lab

- **Interactive SQL Editor**: Write and execute queries with syntax validation
- **AI Assistant**: Generate queries using natural language prompts
- **Quick Templates**: Access pre-built queries for common cost analysis scenarios
- **Query History**: Track and reuse previous queries
- **Export Results**: Save and download query results as CSV

### 4. Instance Rate Card

- Compare AWS instance pricing across regions
- Find cost-effective alternatives
- Analyze price-performance ratios
- Get rightsizing recommendations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Lucide React** for the comprehensive icon set
- **Recharts** for powerful data visualization
- **Tailwind CSS** for utility-first styling
- **Next.js Team** for the amazing framework

## 📞 Support

- **Documentation**: [Wiki](https://github.com/jasonwu001t/infralyzer-app/wiki)
- **Issues**: [GitHub Issues](https://github.com/jasonwu001t/infralyzer-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jasonwu001t/infralyzer-app/discussions)

## 🎯 Roadmap

### ✅ Recently Completed

- [x] Component-based architecture with API patterns
- [x] Modular SQL Lab with AI assistant
- [x] User authentication and role-based access
- [x] Advanced dashboard with filtering system
- [x] AWS pricing comparison tool
- [x] Comprehensive cost analytics pages

### 🔄 In Progress

- [ ] Enhanced error handling and performance optimization
- [ ] Additional pre-built SQL templates
- [ ] More sophisticated AI query generation

### 📋 Planned Features

- [ ] Multi-cloud support (Azure, GCP)
- [ ] Real-time data streaming integration
- [ ] Advanced ML models for cost prediction
- [ ] Mobile responsive improvements
- [ ] Enterprise SSO integration
- [ ] API documentation and developer tools

## 📊 Current Status

- **Build Status**: ✅ Successfully building and deploying
- **Code Quality**: ✅ TypeScript, ESLint configured
- **Test Coverage**: 🔄 In development
- **Performance**: ✅ Optimized bundle sizes and loading states
- **Documentation**: ✅ Component architecture documented

### Recent Updates

- **v1.0.0**: Complete architectural refactor with component-based API patterns
- **SQL Lab**: Modular component architecture (740 → 150 lines)
- **Type Safety**: Enhanced TypeScript coverage and proper typing
- **Performance**: Optimized data fetching and smart re-rendering
- **UX**: Improved loading states, error handling, and user feedback

---

**Built with ❤️ for the FinOps community**
