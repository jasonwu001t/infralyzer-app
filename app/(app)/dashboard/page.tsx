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
  const kpiData = [
    { title: "Month-to-Date Spend", value: "$1,250,430", trend: "+2.5% vs last period", icon: "DollarSign" },
    { title: "Forecasted Spend", value: "$2,450,800", trend: "+4.1% vs last month", icon: "TrendingUp" },
    { title: "Previous Month Spend", value: "$2,354,210", trend: "Total for August", icon: "CalendarDays" },
    { title: "Avg Daily Spend", value: "$81,693", trend: "-1.2% vs last period", icon: "TrendingDown" },
  ]

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Dashboard Header Tools - Compact AI & FinOps Access */}
      <DashboardHeaderTools />

      {/* Enhanced Dashboard Filters */}
      <EnhancedDashboardFilters />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} title={kpi.title} value={kpi.value} trend={kpi.trend} icon={kpi.icon} />
        ))}
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
  )
}
