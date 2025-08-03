"use client"

import { DashboardFilterProvider } from "@/lib/hooks/use-dashboard-filters"
import DashboardFilters from "../components/dashboard-filters"
import KpiCard from "../components/kpi-card"
import SpendSummaryChart from "../components/spend-summary-chart"
import ServiceCostsTable from "../components/service-costs-table"
import AccountCostsTable from "../components/account-costs-table"
import OptimizationPotential from "../components/optimization-potential"
import AnomalyFeed from "../components/anomaly-feed"
import CostByChargeType from "../components/cost-by-charge-type"
import CostByPurchaseOption from "../components/cost-by-purchase-option"
import DiscountCoverageGauges from "../components/discount-coverage-gauges"
import CommitmentExpirations from "../components/commitment-expirations"
import RegionalCostBreakdown from "../components/regional-cost-breakdown"
import TopCostByTag from "../components/top-cost-by-tag"
import BudgetVsForecast from "../components/budget-vs-forecast"
import ForecastAccuracy from "../components/forecast-accuracy"

export default function CostAnalyticsPage() {
  return (
    <DashboardFilterProvider>
      <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cost Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of cost types, rates, and optimization opportunities
          </p>
        </div>
        <DashboardFilters />
      </div>

      {/* Cost KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard kpiId="mtd-spend" />
        <KpiCard kpiId="forecast" />
        <KpiCard kpiId="savings" />
        <KpiCard kpiId="budget-utilization" />
      </div>

      {/* Cost Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendSummaryChart />
        <BudgetVsForecast />
      </div>

      {/* Cost Breakdown Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ServiceCostsTable />
        <AccountCostsTable />
      </div>

      {/* Cost Type Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CostByChargeType />
        <CostByPurchaseOption />
        <DiscountCoverageGauges />
      </div>

      {/* Optimization & Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OptimizationPotential />
        <AnomalyFeed />
      </div>

      {/* Regional & Tag Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RegionalCostBreakdown />
        <TopCostByTag />
      </div>

      {/* Forecasting & Commitments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ForecastAccuracy />
        <CommitmentExpirations />
      </div>
      </div>
    </DashboardFilterProvider>
  )
}