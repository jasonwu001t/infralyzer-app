import DashboardFilters from "../components/dashboard-filters"
import AnomalyFeed from "../components/anomaly-feed"
import AnomalyImpactWidget from "../components/anomaly-impact-widget"
import ForecastAccuracy from "../components/forecast-accuracy"
import FinopsMaturityScore from "../components/finops-maturity-score"
import TopGrowingServices from "../components/top-growing-services"
import UnitCostAnalysis from "../components/unit-cost-analysis"

export default function AiInsightsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <DashboardFilters />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AnomalyFeed />
        <div className="space-y-4">
          <AnomalyImpactWidget />
          <ForecastAccuracy />
        </div>
        <FinopsMaturityScore />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopGrowingServices />
        <UnitCostAnalysis />
      </div>
    </div>
  )
}
