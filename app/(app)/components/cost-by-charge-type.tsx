/**
 * Used by: dashboard, cost-analytics
 * Purpose: Pie chart showing cost breakdown by charge type (usage, tax, credit)
 */
"use client"

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface ChargeTypeData {
  type: string
  cost: number
  fill: string
}

const generateChargeTypeData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<ChargeTypeData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  return [
    { type: "Usage", cost: Math.floor(1150000 * multiplier), fill: "var(--color-usage)" },
    { type: "Tax", cost: Math.floor(85000 * multiplier), fill: "var(--color-tax)" },
    { type: "Credit", cost: Math.floor(-15000 * multiplier), fill: "var(--color-credit)" },
  ]
}

const chartConfig = {
  cost: { label: "Cost" },
  usage: { label: "Usage", color: "hsl(var(--chart-1))" },
  tax: { label: "Tax", color: "hsl(var(--chart-2))" },
  credit: { label: "Credit", color: "hsl(var(--chart-3))" },
}

// Component API configuration
const COST_BY_CHARGE_TYPE_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/cost-by-charge-type',
  cacheDuration: 5 * 60 * 1000, // 5 minutes
}

export default function CostByChargeType() {
  const { user } = useAuth()
  const { data: chartData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateChargeTypeData(filters, user.id, user.role, user.organization)
    },
    COST_BY_CHARGE_TYPE_API_CONFIG.relevantFilters
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Charge Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Charge Type</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!chartData) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Charge Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="type" hideLabel />} />
              <Pie data={chartData} dataKey="cost" nameKey="type" innerRadius={40} strokeWidth={5}>
                {chartData.map((entry) => (
                  <Cell key={entry.type} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="type" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { COST_BY_CHARGE_TYPE_API_CONFIG }
