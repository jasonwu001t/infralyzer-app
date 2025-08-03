/**
 * Used by: dashboard, cost-analytics, discounts
 * Purpose: Pie chart showing cost breakdown by purchase option (on-demand, reserved, spot)
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

interface PurchaseOptionData {
  option: string
  cost: number
  percentage: number
  fill: string
}

const generatePurchaseOptionData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<PurchaseOptionData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const basePurchaseOptions = [
    { option: "On-Demand", baseCost: 450000, fill: "var(--color-od)" },
    { option: "Savings Plan", baseCost: 550000, fill: "var(--color-sp)" },
    { option: "Reserved", baseCost: 200000, fill: "var(--color-ri)" },
    { option: "Spot", baseCost: 50000, fill: "var(--color-spot)" },
  ]

  // Apply role-based variations
  const roleModifiers = {
    'On-Demand': role === 'admin' ? 1 : role === 'analyst' ? 1.2 : 1.5, // Viewers see more on-demand usage
    'Savings Plan': role === 'admin' ? 1 : role === 'analyst' ? 0.9 : 0.7,
    'Reserved': role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6,
    'Spot': role === 'admin' ? 1 : 0.5 // Non-admins see less spot usage
  }

  const dataWithCosts = basePurchaseOptions.map(option => {
    const roleModifier = roleModifiers[option.option as keyof typeof roleModifiers] || 1
    const cost = Math.floor(option.baseCost * multiplier * roleModifier)
    return {
      ...option,
      cost
    }
  })

  const totalCost = dataWithCosts.reduce((sum, option) => sum + option.cost, 0)

  return dataWithCosts.map(option => ({
    option: option.option,
    cost: option.cost,
    percentage: Math.round((option.cost / totalCost) * 100),
    fill: option.fill
  }))
}

const chartConfig = {
  cost: { label: "Cost" },
  od: { label: "On-Demand", color: "hsl(var(--chart-1))" },
  sp: { label: "Savings Plan", color: "hsl(var(--chart-2))" },
  ri: { label: "Reserved", color: "hsl(var(--chart-3))" },
  spot: { label: "Spot", color: "hsl(var(--chart-4))" },
}

// Component API configuration
const PURCHASE_OPTION_API_CONFIG = {
  relevantFilters: ['dateRange', 'services', 'accounts', 'regions'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/purchase-options',
  cacheDuration: 10 * 60 * 1000, // 10 minutes
}

export default function CostByPurchaseOption() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: chartData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generatePurchaseOptionData(filters, user.id, user.role, user.organization)
    },
    PURCHASE_OPTION_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  // Don't fetch data until user is authenticated
  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Purchase Option</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Purchase Option</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Purchase Option</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!chartData || chartData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Purchase Option</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No purchase option data available.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Purchase Option</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="option" hideLabel />} />
              <Pie data={chartData} dataKey="cost" nameKey="option" innerRadius={50} strokeWidth={5}>
                {chartData.map((entry) => (
                  <Cell key={entry.option} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="option" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { PURCHASE_OPTION_API_CONFIG }
