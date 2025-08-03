/**
 * Used by: cost-analytics
 * Purpose: Waterfall chart showing how list costs transform to effective costs through various discounts
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { TrendingDown, Layers } from "lucide-react"

interface WaterfallStep {
  step: string
  stepLabel: string
  value: number
  cumulative: number
  type: 'positive' | 'negative' | 'total'
  description: string
  percentage: number
}

const generateWaterfallData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<{
  waterfallSteps: WaterfallStep[],
  totalSavings: number,
  effectiveRate: number
}> => {
  const baseAmount = organization === 'StartupCo' ? 100000 : 150000
  const roleMultiplier = role === 'admin' ? 1.1 : role === 'analyst' ? 1.0 : 0.9
  const listCost = Math.round(baseAmount * roleMultiplier)

  // Calculate progressive discounts
  const contractDiscount = Math.round(listCost * (role === 'admin' ? 0.12 : 0.08))
  const volumeDiscount = Math.round((listCost - contractDiscount) * 0.05)
  const commitmentDiscount = Math.round((listCost - contractDiscount - volumeDiscount) * 0.18)
  const regionDiscount = Math.round((listCost - contractDiscount - volumeDiscount - commitmentDiscount) * 0.03)
  const partnerDiscount = Math.round((listCost - contractDiscount - volumeDiscount - commitmentDiscount - regionDiscount) * 0.02)
  
  const effectiveCost = listCost - contractDiscount - volumeDiscount - commitmentDiscount - regionDiscount - partnerDiscount
  const totalSavings = listCost - effectiveCost

  const waterfallSteps: WaterfallStep[] = [
    {
      step: '1',
      stepLabel: 'List Cost',
      value: listCost,
      cumulative: listCost,
      type: 'total',
      description: 'Starting point - published list prices',
      percentage: 0
    },
    {
      step: '2',
      stepLabel: 'Contract Discount',
      value: -contractDiscount,
      cumulative: listCost - contractDiscount,
      type: 'negative',
      description: 'Enterprise agreement negotiated rates',
      percentage: (contractDiscount / listCost) * 100
    },
    {
      step: '3',
      stepLabel: 'Volume Discount',
      value: -volumeDiscount,
      cumulative: listCost - contractDiscount - volumeDiscount,
      type: 'negative',
      description: 'High usage volume tier discounts',
      percentage: (volumeDiscount / listCost) * 100
    },
    {
      step: '4',
      stepLabel: 'Commitment Discount',
      value: -commitmentDiscount,
      cumulative: listCost - contractDiscount - volumeDiscount - commitmentDiscount,
      type: 'negative',
      description: 'Reserved capacity and savings plans',
      percentage: (commitmentDiscount / listCost) * 100
    },
    {
      step: '5',
      stepLabel: 'Region Optimization',
      value: -regionDiscount,
      cumulative: listCost - contractDiscount - volumeDiscount - commitmentDiscount - regionDiscount,
      type: 'negative',
      description: 'Lower-cost region deployment',
      percentage: (regionDiscount / listCost) * 100
    },
    {
      step: '6',
      stepLabel: 'Partner Discount',
      value: -partnerDiscount,
      cumulative: effectiveCost,
      type: 'negative',
      description: 'Reseller or consulting partner rates',
      percentage: (partnerDiscount / listCost) * 100
    },
    {
      step: '7',
      stepLabel: 'Effective Cost',
      value: effectiveCost,
      cumulative: effectiveCost,
      type: 'total',
      description: 'Final cost after all optimizations',
      percentage: (totalSavings / listCost) * 100
    }
  ]

  return {
    waterfallSteps,
    totalSavings,
    effectiveRate: (effectiveCost / listCost)
  }
}

// Component API configuration
const COST_WATERFALL_API_CONFIG = {
  relevantFilters: ['dateRange'] as (keyof DashboardFilters)[],
  endpoint: '/api/cost-analytics/cost-waterfall',
  cacheDuration: 20 * 60 * 1000, // 20 minutes
}

export default function CostWaterfallChart() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: waterfallData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateWaterfallData(filters, user.id, user.role, user.organization)
    },
    COST_WATERFALL_API_CONFIG.relevantFilters,
    [user?.id]
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cost Waterfall Analysis</CardTitle>
        <CardDescription>Loading cost transformation analysis...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error || !waterfallData) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cost Waterfall Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error || "Failed to load waterfall data"}</p>
        </div>
      </CardContent>
    </Card>
  )

  // Prepare data for the waterfall chart
  const chartData = waterfallData.waterfallSteps.map((step, index) => {
    let baseValue = 0
    if (step.type === 'negative' && index > 0) {
      // For negative values, base is the cumulative value
      baseValue = step.cumulative
    } else if (step.type === 'total') {
      baseValue = 0
    }

    return {
      ...step,
      baseValue,
      displayValue: Math.abs(step.value),
      fill: step.type === 'total' ? '#3b82f6' : 
            step.type === 'negative' ? '#22c55e' : '#ef4444'
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.stepLabel}</p>
          <p className="text-sm text-gray-600">{data.description}</p>
          <p className="text-sm">
            <span className="font-medium">Value: </span>
            ${Math.abs(data.value).toLocaleString()}
            {data.percentage > 0 && (
              <span className="text-green-600 ml-2">
                ({data.percentage.toFixed(1)}% savings)
              </span>
            )}
          </p>
          <p className="text-sm">
            <span className="font-medium">Cumulative: </span>
            ${data.cumulative.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Cost Waterfall Analysis
        </CardTitle>
        <CardDescription>
          Visualize how list costs transform into effective costs through progressive discounts
        </CardDescription>
        <div className="flex gap-6 text-sm">
          <div className="text-blue-600 font-medium">
            List Cost: ${waterfallData.waterfallSteps[0].value.toLocaleString()}
          </div>
          <div className="text-green-600 font-medium">
            Total Savings: ${waterfallData.totalSavings.toLocaleString()}
          </div>
          <div className="text-purple-600 font-medium">
            Effective Rate: {((1 - waterfallData.effectiveRate) * 100).toFixed(1)}% discount
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Waterfall Chart */}
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stepLabel" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="displayValue" stackId="waterfall">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Discount Breakdown Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waterfallData.waterfallSteps.slice(1, -1).map((step, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-800">{step.stepLabel}</h4>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    ${Math.abs(step.value).toLocaleString()}
                  </span>
                  <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded">
                    {step.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Remaining: ${step.cumulative.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Cost Transformation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Starting Cost:</span>
                <div className="font-semibold text-blue-600">
                  ${waterfallData.waterfallSteps[0].value.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Total Discounts Applied:</span>
                <div className="font-semibold text-green-600">
                  ${waterfallData.totalSavings.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Final Effective Cost:</span>
                <div className="font-semibold text-purple-600">
                  ${waterfallData.waterfallSteps[waterfallData.waterfallSteps.length - 1].value.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}