"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
// Import discount/savings components
import CostByPurchaseOption from "../components/cost-by-purchase-option"
import SpotSavingsWidget from "../components/spot-savings-widget"
import AwsCreditsStatus from "../components/aws-credits-status"

export default function CostAnalyticsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const tab = searchParams.get('tab')
    if (tab && ['overview', 'analysis', 'discounts', 'contracts', 'optimization'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <DashboardFilterProvider>
      <div className="flex-1 space-y-6 p-8 pt-6">
        {/* Header */}
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cost Analytics & Management</h1>
            <p className="text-muted-foreground">
              Comprehensive cost analysis, savings tracking, discount management, and vendor contract oversight
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              🔍 Analysis
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              💰 Discounts
            </TabsTrigger>
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              📋 Contracts
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              🎯 Planning
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

          {/* Tab 2: Rate & Analysis */}
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

          {/* Tab 3: Discounts & Savings */}
          <TabsContent value="discounts" className="space-y-6">
            <div className="space-y-6">
              {/* Discount Coverage & Purchase Options */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <DiscountCoverageGauges />
                <CostByPurchaseOption />
              </div>
              
              {/* Savings & Credits Tracking */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <CommitmentExpirations />
                <SpotSavingsWidget />
                <AwsCreditsStatus />
              </div>

              {/* Discount Performance Insights */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                <h4 className="font-semibold text-green-900 mb-3">💸 Savings Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-green-700 mb-1">Reserved Instances</div>
                    <p className="text-green-600">Active RIs providing 15-20% savings on consistent workloads</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-blue-700 mb-1">Savings Plans</div>
                    <p className="text-blue-600">Flexible commitments delivering 10-17% across services</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-purple-700 mb-1">Spot Instances</div>
                    <p className="text-purple-600">Dynamic pricing achieving 60-90% cost reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 4: Contract & Invoice Management */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="space-y-6">
              {/* Contract Overview */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📄 Active Contracts
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">AWS Enterprise Support</div>
                        <div className="text-sm text-muted-foreground">Annual commitment</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$48,000/year</div>
                        <div className="text-sm text-green-600">Expires Dec 2024</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">Reserved Instance Plan</div>
                        <div className="text-sm text-muted-foreground">3-year EC2 commitment</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$120,000/year</div>
                        <div className="text-sm text-orange-600">Expires Mar 2025</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">Compute Savings Plan</div>
                        <div className="text-sm text-muted-foreground">1-year flexible commitment</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$75,000/year</div>
                        <div className="text-sm text-blue-600">Expires Aug 2024</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    💳 Invoice Management
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">January 2024</div>
                        <div className="text-sm text-muted-foreground">Monthly billing cycle</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$23,456.78</div>
                        <div className="text-sm text-green-600">Paid</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">February 2024</div>
                        <div className="text-sm text-muted-foreground">Monthly billing cycle</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$28,912.34</div>
                        <div className="text-sm text-orange-600">Due Mar 15</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">March 2024</div>
                        <div className="text-sm text-muted-foreground">Estimated</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$25,678.90</div>
                        <div className="text-sm text-blue-600">Projected</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Relationship Management */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  🤝 Vendor Relationships & Negotiations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">AWS Account Manager</h4>
                    <p className="text-sm text-blue-700 mb-2">Sarah Johnson - Enterprise Sales</p>
                    <p className="text-xs text-blue-600">Next review: Q2 2024 for EDP renewal</p>
                    <div className="mt-3 text-xs">
                      <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded">Active EDP</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Cost Optimization</h4>
                    <p className="text-sm text-green-700 mb-2">Current discount rate: 12%</p>
                    <p className="text-xs text-green-600">Potential for 15% with increased commitment</p>
                    <div className="mt-3 text-xs">
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded">Opportunity</span>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Contract Status</h4>
                    <p className="text-sm text-purple-700 mb-2">Multi-year agreement active</p>
                    <p className="text-xs text-purple-600">Auto-renewal clause in effect</p>
                    <div className="mt-3 text-xs">
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded">Secured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Optimization Planning */}
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