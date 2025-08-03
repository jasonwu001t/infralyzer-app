"use client"

import { useAuth, useUserData } from "@/lib/hooks/use-auth"
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
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()}, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your {user.organization} cost overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Dashboard Header Tools - Compact AI & FinOps Access */}
        <DashboardHeaderTools />

        {/* Enhanced Dashboard Filters */}
        <EnhancedDashboardFilters />

        {/* KPI Cards - Now using component-based API */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard kpiId="mtd-spend" />
          <KpiCard kpiId="forecast" />
          <KpiCard kpiId="savings" />
          {user.role === 'admin' && <KpiCard title="Budget Utilization" value="73.2%" trend="+1.4% vs target" icon="BarChart3" />}
        </div>

      {/* Section: Overview */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SpendSummaryChart />
          <div className="space-y-4">
            <BudgetVsForecast />
            <RegionalCostBreakdown />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <DailySpendStackedBar />
          <TopAccountsWidget />
          <CostByPurchaseOption />
        </div>
      </div>

      {/* Section: Optimization & Discounts */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Optimization & Discounts</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <OptimizationPotential />
          <DiscountCoverageGauges />
          <CommitmentExpirations />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TopGrowingServices />
          <EbsVolumeAnalysis />
          <Ec2CostBreakdown />
        </div>
      </div>

      {/* Section: Governance & Health */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Governance & Health</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AnomalyFeed />
          <TopCostByTag />
          <div className="space-y-4">
            <UntaggedResourcesCost />
            <ForecastAccuracy />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <DataTransferHotspots />
          <CostByChargeType />
          <AwsCreditsStatus />
        </div>
      </div>

      {/* Section: BI & Insights */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">BI & Insights</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UnitCostAnalysis />
          <WorkloadCostEfficiency />
          <div className="space-y-4">
            <SpotSavingsWidget />
            <CloudRoiWidget />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StorageGrowthChart />
          <EnvironmentCostSplit />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AnomalyImpactWidget />
          <ComputeEfficiencyMetric />
          <MultiCloudSpend />
        </div>
      </div>

      {/* Section: Detailed Breakdowns */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Detailed Breakdowns</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ServiceCostsTable />
          <AccountCostsTable />
        </div>
      </div>
      </div>
    </DashboardFilterProvider>
  )
}
