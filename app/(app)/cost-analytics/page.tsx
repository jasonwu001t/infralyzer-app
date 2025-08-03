"use client"

import { DashboardFilterProvider } from "@/lib/hooks/use-dashboard-filters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardFilters from "../components/dashboard-filters"
import KpiCard from "../components/kpi-card"
import CostTypeComparison from "../components/cost-type-comparison"
import RateAnalysisTable from "../components/rate-analysis-table"
import SavingsScenarioCalculator from "../components/savings-scenario-calculator"
import PurchaseOptionImpact from "../components/purchase-option-impact"
import CostWaterfallChart from "../components/cost-waterfall-chart"
import CommitmentContractAnalysis from "../components/commitment-contract-analysis"
import ServiceCostsTable from "../components/service-costs-table"
import AccountCostsTable from "../components/account-costs-table"
import OptimizationPotential from "../components/optimization-potential"
import DiscountCoverageGauges from "../components/discount-coverage-gauges"
import CommitmentExpirations from "../components/commitment-expirations"

export default function CostAnalyticsPage() {
  return (
    <DashboardFilterProvider>
      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Header */}
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Advanced Cost Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive cloud cost management with list, billed, contracted, and effective cost analysis
            </p>
          </div>
          <DashboardFilters />
        </div>

        {/* Cost KPI Overview - Always visible */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard kpiId="mtd-spend" />
          <KpiCard kpiId="effective-rate" />
          <KpiCard kpiId="total-savings" />
          <KpiCard kpiId="discount-coverage" />
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              📊 Cost Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              🔍 Rate & Discount Analysis
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              🎯 Optimization Planning
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Cost Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-6">
              {/* Cost Type Comparison */}
              <CostTypeComparison />
              
              {/* Current State Breakdown */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ServiceCostsTable title="Service Cost Analysis" showTrends={true} />
                <AccountCostsTable />
              </div>

              {/* Current Optimization Status */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <OptimizationPotential />
                <DiscountCoverageGauges />
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Rate & Discount Analysis */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="space-y-6">
              {/* Cost Transformation Flow */}
              <CostWaterfallChart />
              
              {/* Detailed Rate Analysis */}
              <RateAnalysisTable />
              
              {/* Strategic Discount Comparison */}
              <CommitmentContractAnalysis />
            </div>
          </TabsContent>

          {/* Tab 3: Optimization Planning */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="space-y-6">
              {/* Interactive Savings Calculator */}
              <SavingsScenarioCalculator />
              
              {/* Purchase Option Strategy */}
              <PurchaseOptionImpact />
              
              {/* Commitment Management */}
              <CommitmentExpirations />

              {/* Cost Management Insights */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h4 className="font-semibold text-blue-900 mb-3">💡 Optimization Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-blue-700 mb-1">Immediate Actions</div>
                    <p className="text-blue-600">Start with contract negotiations for quick 8-15% savings with low risk</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-purple-700 mb-1">Medium-term Strategy</div>
                    <p className="text-purple-600">Add Reserved Instances or Savings Plans for 15-25% additional savings</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-green-700 mb-1">Long-term Optimization</div>
                    <p className="text-green-600">Combine all strategies for maximum 30-45% total cost reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardFilterProvider>
  )
}