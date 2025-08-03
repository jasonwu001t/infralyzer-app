# Infralyzer - AI-Powered Cloud Cost Management Platform

[![GitHub license](https://img.shields.io/github/license/jasonwu001t/infralyzer-app)](https://github.com/jasonwu001t/infralyzer-app/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-19-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-blue)](https://tailwindcss.com/)

A comprehensive **FinOps** (Financial Operations) platform that empowers organizations to optimize their cloud costs through AI-powered insights, advanced analytics, and intelligent automation.

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
- **Interactive SQL editor** with syntax highlighting
- **AI-powered query generation** for AWS Cost and Usage Reports
- **Pre-built templates** for common cost analysis scenarios
- **Query history** and result export capabilities

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

- **Node.js** 18+ 
- **npm** or **pnpm**
- **Git**

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
- **Framework**: Next.js 19 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks and context
- **Charts**: Recharts for data visualization

### Backend Integration
- **API Routes**: Next.js API routes for frontend-backend communication
- **Data Engine**: Integration with `de-polars` Python analytics engine
- **Pricing APIs**: AWS Pricing API integration
- **Authentication**: Simple localStorage-based auth (demo)

### Key Components
```
app/
├── (app)/                    # Protected app routes
│   ├── dashboard/           # Main dashboard
│   ├── cost-analytics/      # Advanced cost analysis
│   ├── sql-lab/            # Query builder and SQL editor
│   ├── instance-rate-card/ # AWS pricing comparison
│   └── capacity/           # Capacity management
├── api/                     # API routes
└── components/             # Reusable UI components
```

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
- Build custom queries for cost data analysis
- Use AI assistant for query generation
- Access pre-built templates
- Save and export query results

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

- [ ] Multi-cloud support (Azure, GCP)
- [ ] Advanced ML models for cost prediction
- [ ] Real-time streaming data integration
- [ ] Mobile application
- [ ] Enterprise SSO integration
- [ ] Advanced role-based access control

---

**Built with ❤️ for the FinOps community**