"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { DashboardFilterProvider } from "@/lib/hooks/use-dashboard-filters"
import KpiCard from "../components/kpi-card"
import DashboardHeaderTools from "../components/dashboard-header-tools"
import EnhancedDashboardFilters from "../components/enhanced-dashboard-filters"
import SpendSummaryChart from "../components/spend-summary-chart"
import ServiceCostsTable from "../components/service-costs-table"
import AccountCostsTable from "../components/account-costs-table"
import DailySpendStackedBar from "../components/daily-spend-stacked-bar"
import DiscountCoverageGauges from "../components/discount-coverage-gauges"
import RegionalCostBreakdown from "../components/regional-cost-breakdown"
import AnomalyFeed from "../components/anomaly-feed"
import TopCostByTag from "../components/top-cost-by-tag"
import Ec2CostBreakdown from "../components/ec2-cost-breakdown"
import OptimizationPotential from "../components/optimization-potential"
import BudgetVsForecast from "../components/budget-vs-forecast"
import TopGrowingServices from "../components/top-growing-services"
import CostByChargeType from "../components/cost-by-charge-type"
import CostByPurchaseOption from "../components/cost-by-purchase-option"
import CommitmentExpirations from "../components/commitment-expirations"
import TopAccountsWidget from "../components/top-accounts-widget"
import UntaggedResourcesCost from "../components/untagged-resources-cost"
import AwsCreditsStatus from "../components/aws-credits-status"
import EbsVolumeAnalysis from "../components/ebs-volume-analysis"
import DataTransferHotspots from "../components/data-transfer-hotspots"
import ForecastAccuracy from "../components/forecast-accuracy"
import UnitCostAnalysis from "../components/unit-cost-analysis"
import WorkloadCostEfficiency from "../components/workload-cost-efficiency"
import SpotSavingsWidget from "../components/spot-savings-widget"
import StorageGrowthChart from "../components/storage-growth-chart"
import EnvironmentCostSplit from "../components/environment-cost-split"
import CloudRoiWidget from "../components/cloud-roi-widget"
import MultiCloudSpend from "../components/multi-cloud-spend"
import ComputeEfficiencyMetric from "../components/compute-efficiency-metric"
import AnomalyImpactWidget from "../components/anomaly-impact-widget"
export default function Dashboard() {
  const { user } = useAuth()
  
  // Generate user-specific KPI data based on user role and organization
  const getUserKpiData = () => {
    if (!user) return []
    
    // Different data based on user role and organization
    const baseMultiplier = user.organization === 'StartupCo' ? 0.3 : 1 // Startup has smaller spend
    const roleMultiplier = user.role === 'admin' ? 1 : user.role === 'analyst' ? 0.8 : 0.6
    
    const multiplier = baseMultiplier * roleMultiplier
    
    return [
      { 
        title: "Month-to-Date Spend", 
        value: `$${(1250430 * multiplier).toLocaleString()}`, 
        trend: user.role === 'admin' ? "+2.5% vs last period" : "+1.8% vs last period", 
        icon: "DollarSign" 
      },
      { 
        title: "Forecasted Spend", 
        value: `$${(2450800 * multiplier).toLocaleString()}`, 
        trend: user.organization === 'StartupCo' ? "+8.1% vs last month" : "+4.1% vs last month", 
        icon: "TrendingUp" 
      },
      { 
        title: "Previous Month Spend", 
        value: `$${(2354210 * multiplier).toLocaleString()}`, 
        trend: "Total for November", 
        icon: "CalendarDays" 
      },
      { 
        title: "Avg Daily Spend", 
        value: `$${(81693 * multiplier).toLocaleString()}`, 
        trend: user.role === 'admin' ? "-1.2% vs last period" : "-0.8% vs last period", 
        icon: "TrendingDown" 
      },
    ]
  }

  const kpiData = getUserKpiData()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  if (!user) return null

  return (
    <DashboardFilterProvider>
      <div className="flex-1 space-y-8 p-6 lg:p-8 pt-6 max-w-[1600px] mx-auto">
        {/* Header Section with improved spacing */}
        <div className="flex flex-col justify-between space-y-3 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {getGreeting()}, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              Here's your {user.organization} cost overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Dashboard Header Tools - Compact AI & FinOps Access */}
        <DashboardHeaderTools />

        {/* Enhanced Dashboard Filters */}
        <EnhancedDashboardFilters />

        {/* KPI Cards with improved spacing */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard kpiId="mtd-spend" />
          <KpiCard kpiId="forecast" />
          <KpiCard kpiId="savings" />
          {user.role === 'admin' && <KpiCard kpiId="budget-utilization" />}
        </div>

      {/* Section: Inform - Cost Visibility & Awareness */}
      <div className="space-y-5 pt-6 border-t border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          <h2 className="text-xl font-bold tracking-tight">📊 Inform - Cost Visibility</h2>
          <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded">Real-time insights</span>
        </div>
        
        {/* Primary spend overview - prominent display */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SpendSummaryChart />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <BudgetVsForecast />
            <ForecastAccuracy />
          </div>
        </div>
        
        {/* Secondary cost breakdowns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DailySpendStackedBar />
          <RegionalCostBreakdown />
          <TopAccountsWidget />
          <CostByPurchaseOption />
        </div>
        
        {/* Detailed service and billing analysis */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <CostByChargeType />
          <Ec2CostBreakdown />
        </div>
      </div>

      {/* Section: Optimize - Cost Optimization & Savings */}
      <div className="space-y-5 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
          <h2 className="text-xl font-bold tracking-tight">🎯 Optimize - Cost Efficiency</h2>
          <span className="text-xs text-muted-foreground bg-green-50 px-2 py-1 rounded">Savings opportunities</span>
        </div>
        
        {/* Primary optimization widgets - key savings opportunities */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <DiscountCoverageGauges />
          <CommitmentExpirations />
        </div>
        
        {/* Secondary optimization metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OptimizationPotential />
          <SpotSavingsWidget />
          <AwsCreditsStatus />
        </div>
        
        {/* Resource-specific optimization */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <EbsVolumeAnalysis />
          <DataTransferHotspots />
          <UnitCostAnalysis />
        </div>
      </div>

      {/* Section: Operate - Governance & Monitoring */}
      <div className="space-y-5 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
          <h2 className="text-xl font-bold tracking-tight">⚡ Operate - Governance & Monitoring</h2>
          <span className="text-xs text-muted-foreground bg-orange-50 px-2 py-1 rounded">Operational control</span>
        </div>
        
        {/* Critical monitoring - anomalies and alerts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AnomalyFeed />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <UntaggedResourcesCost />
            <TopGrowingServices />
          </div>
        </div>
        
        {/* Governance and compliance metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TopCostByTag />
          <WorkloadCostEfficiency />
          <ComputeEfficiencyMetric />
        </div>
      </div>

      {/* Section: Strategic Analytics & Multi-Cloud */}
      <div className="space-y-5 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
          <h2 className="text-xl font-bold tracking-tight">📈 Strategic Analytics</h2>
          <span className="text-xs text-muted-foreground bg-purple-50 px-2 py-1 rounded">Business intelligence</span>
        </div>
        
        {/* Strategic cost insights */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <MultiCloudSpend />
          <EnvironmentCostSplit />
        </div>
        
        {/* Growth and trend analysis */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StorageGrowthChart />
          <CloudRoiWidget />
          <AnomalyImpactWidget />
        </div>
      </div>

      {/* Section: Detailed Analysis Tables */}
      <div className="space-y-5 pt-8 border-t border-border/40 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gray-500 rounded-full"></div>
          <h2 className="text-xl font-bold tracking-tight">📋 Detailed Analysis</h2>
          <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded">Granular data</span>
        </div>
        
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ServiceCostsTable />
          <AccountCostsTable />
        </div>
      </div>
      </div>
    </DashboardFilterProvider>
  )
}


