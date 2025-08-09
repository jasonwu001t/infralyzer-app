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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface ChargeTypeData {
  type: string
  cost: number
  fill: string
  description: string
  breakdown: { [key: string]: number }
  percentage: number
  trend: 'up' | 'down' | 'stable'
  monthlyChange: number
}

const generateChargeTypeData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<ChargeTypeData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const usageCost = Math.floor(1150000 * multiplier)
  const taxCost = Math.floor(85000 * multiplier)
  const creditCost = Math.floor(-15000 * multiplier)
  const totalPositiveCost = usageCost + taxCost
  const totalCost = totalPositiveCost + Math.abs(creditCost)

  return [
    { 
      type: "Usage Charges", 
      cost: usageCost, 
      fill: "var(--color-usage)",
      description: "Direct service consumption and resource usage fees",
      breakdown: {
        "Compute Services": Math.floor(usageCost * 0.45),
        "Storage Services": Math.floor(usageCost * 0.25),
        "Data Transfer": Math.floor(usageCost * 0.12),
        "Database Services": Math.floor(usageCost * 0.18)
      },
      percentage: Math.round((usageCost / totalCost) * 100),
      trend: 'up' as const,
      monthlyChange: 8.5
    },
    { 
      type: "Tax & Fees", 
      cost: taxCost, 
      fill: "var(--color-tax)",
      description: "Government taxes, VAT, and regulatory fees",
      breakdown: {
        "Sales Tax": Math.floor(taxCost * 0.70),
        "VAT": Math.floor(taxCost * 0.20),
        "Regulatory Fees": Math.floor(taxCost * 0.10)
      },
      percentage: Math.round((taxCost / totalCost) * 100),
      trend: 'stable' as const,
      monthlyChange: 0.2
    },
    { 
      type: "Credits Applied", 
      cost: creditCost, 
      fill: "var(--color-credit)",
      description: "Promotional credits, discounts, and adjustments",
      breakdown: {
        "Startup Credits": Math.floor(Math.abs(creditCost) * 0.60),
        "Support Credits": Math.floor(Math.abs(creditCost) * 0.25),
        "Billing Adjustments": Math.floor(Math.abs(creditCost) * 0.15)
      },
      percentage: Math.round((Math.abs(creditCost) / totalCost) * 100),
      trend: 'down' as const,
      monthlyChange: -12.3
    },
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: chartData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateChargeTypeData(filters, user.id, user.role, user.organization)
    },
    COST_BY_CHARGE_TYPE_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  if (isLoading || authLoading || !isAuthenticated) return (
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

  const totalCost = chartData.reduce((sum, item) => sum + Math.abs(item.cost), 0)
  const netCost = chartData.reduce((sum, item) => sum + item.cost, 0)

  const getTrendBadge = (trend: string, change: number) => {
    const variant = trend === 'up' ? 'destructive' : trend === 'down' ? 'default' : 'secondary'
    const symbol = trend === 'up' ? '+' : trend === 'down' ? '' : '±'
    return (
      <Badge variant={variant} className="text-xs">
        {symbol}{change}%
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Billing Structure Analysis</span>
          <Badge variant="outline" className="text-xs">
            Net: ${netCost.toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="type" hideLabel />} />
                  <Pie data={chartData} dataKey="cost" nameKey="type" innerRadius={35} strokeWidth={3}>
                    {chartData.map((entry) => (
                      <Cell key={entry.type} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-center">
              <div className="text-lg font-bold">${totalCost.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Billing Volume</div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.type} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill.replace('var(--color-', 'hsl(var(--chart-').replace(')', '))') }}
                    />
                    <span className="font-medium text-sm">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">
                      ${Math.abs(item.cost).toLocaleString()}
                    </span>
                    {getTrendBadge(item.trend, item.monthlyChange)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {item.description}
                </div>
                <div className="text-xs text-right text-muted-foreground">
                  {item.percentage}% of total
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Detailed Breakdown:</div>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="h-8">Charge Category</TableHead>
                <TableHead className="h-8">Subcategory</TableHead>
                <TableHead className="h-8">Amount</TableHead>
                <TableHead className="h-8">% of Category</TableHead>
                <TableHead className="h-8">Monthly Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((category) => 
                Object.entries(category.breakdown).map(([subcat, amount], index) => (
                  <TableRow key={`${category.type}-${subcat}`} className="text-xs">
                    {index === 0 && (
                      <TableCell rowSpan={Object.keys(category.breakdown).length} className="font-medium align-top">
                        {category.type}
                      </TableCell>
                    )}
                    <TableCell>{subcat}</TableCell>
                    <TableCell className="font-medium">
                      ${(amount as number).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {Math.round(((amount as number) / Math.abs(category.cost)) * 100)}%
                    </TableCell>
                    {index === 0 && (
                      <TableCell rowSpan={Object.keys(category.breakdown).length} className="align-top">
                        {getTrendBadge(category.trend, category.monthlyChange)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { COST_BY_CHARGE_TYPE_API_CONFIG }
