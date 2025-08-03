import DashboardFilters from "../components/dashboard-filters"
import OptimizationPotential from "../components/optimization-potential"
import DiscountCoverageGauges from "../components/discount-coverage-gauges"
import CommitmentExpirations from "../components/commitment-expirations"
import TopGrowingServices from "../components/top-growing-services"
import EbsVolumeAnalysis from "../components/ebs-volume-analysis"
import SpotSavingsWidget from "../components/spot-savings-widget"
import UntaggedResourcesCost from "../components/untagged-resources-cost"
import AnomalyFeed from "../components/anomaly-feed"

export default function OptimizationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Optimization</h1>
        <DashboardFilters />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OptimizationPotential />
        <div className="space-y-4">
          <DiscountCoverageGauges />
          <SpotSavingsWidget />
        </div>
        <CommitmentExpirations />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnomalyFeed />
        <div className="space-y-4">
          <UntaggedResourcesCost />
          <EbsVolumeAnalysis />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <TopGrowingServices />
      </div>
    </div>
  )
}
