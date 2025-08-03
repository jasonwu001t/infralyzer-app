"use client"

import { DashboardFilterProvider } from "@/lib/hooks/use-dashboard-filters"
import DashboardFilters from "../components/dashboard-filters"
import KpiCard from "../components/kpi-card"
import ServiceCostsTable from "../components/service-costs-table"
import AccountCostsTable from "../components/account-costs-table"
import RegionalCostBreakdown from "../components/regional-cost-breakdown"
import Ec2CostBreakdown from "../components/ec2-cost-breakdown"
import StorageGrowthChart from "../components/storage-growth-chart"
import ComputeEfficiencyMetric from "../components/compute-efficiency-metric"
import WorkloadCostEfficiency from "../components/workload-cost-efficiency"
import UnitCostAnalysis from "../components/unit-cost-analysis"
import EbsVolumeAnalysis from "../components/ebs-volume-analysis"
import DataTransferHotspots from "../components/data-transfer-hotspots"
import OptimizationPotential from "../components/optimization-potential"
import AnomalyFeed from "../components/anomaly-feed"
import ForecastAccuracy from "../components/forecast-accuracy"

export default function CapacityManagementPage() {
  return (
    <DashboardFilterProvider>
      <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Capacity Management</h1>
          <p className="text-muted-foreground">
            Advanced insights into resource utilization, efficiency metrics, and capacity planning
          </p>
        </div>
        <DashboardFilters />
      </div>

      {/* Capacity KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard kpiId="mtd-spend" />
        <ComputeEfficiencyMetric />
        <KpiCard kpiId="savings" />
        <WorkloadCostEfficiency />
      </div>

      {/* Resource Efficiency Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ServiceCostsTable />
        <AccountCostsTable />
      </div>

      {/* Compute & Storage Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Ec2CostBreakdown />
        <EbsVolumeAnalysis />
        <StorageGrowthChart />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UnitCostAnalysis />
        <DataTransferHotspots />
      </div>

      {/* Regional & Geographic Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RegionalCostBreakdown />
        <OptimizationPotential />
      </div>

      {/* Monitoring & Forecasting */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnomalyFeed />
        <ForecastAccuracy />
      </div>
      </div>
    </DashboardFilterProvider>
  )
}