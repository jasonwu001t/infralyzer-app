import DashboardFilters from "../components/dashboard-filters"
import DiscountCoverageGauges from "../components/discount-coverage-gauges"
import CommitmentExpirations from "../components/commitment-expirations"
import CostByPurchaseOption from "../components/cost-by-purchase-option"
import SpotSavingsWidget from "../components/spot-savings-widget"
import AwsCreditsStatus from "../components/aws-credits-status"

export default function DiscountsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Discounts & Commitments</h1>
        <DashboardFilters />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DiscountCoverageGauges />
        <CostByPurchaseOption />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CommitmentExpirations />
        <SpotSavingsWidget />
        <AwsCreditsStatus />
      </div>
    </div>
  )
}
