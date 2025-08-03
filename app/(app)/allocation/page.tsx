import DashboardFilters from "../components/dashboard-filters"
import TopCostByTag from "../components/top-cost-by-tag"
import RegionalCostBreakdown from "../components/regional-cost-breakdown"
import EnvironmentCostSplit from "../components/environment-cost-split"
import TopAccountsWidget from "../components/top-accounts-widget"
import WorkloadCostEfficiency from "../components/workload-cost-efficiency"
import AccountCostsTable from "../components/account-costs-table"
import ServiceCostsTable from "../components/service-costs-table"

export default function CostAllocationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Cost Allocation</h1>
        <DashboardFilters />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopCostByTag />
        <EnvironmentCostSplit />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RegionalCostBreakdown />
        <TopAccountsWidget />
        <WorkloadCostEfficiency />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AccountCostsTable />
        <ServiceCostsTable />
      </div>
    </div>
  )
}
