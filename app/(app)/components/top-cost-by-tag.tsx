/**
 * Used by: dashboard, cost-analytics, allocation
 * Purpose: Bar chart showing highest costs grouped by resource tags for allocation analysis
 */
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface TagCostData {
  tag: string
  cost: number
}

const generateTagCostData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<TagCostData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const baseData = [
    { tag: "Project: Phoenix", baseCost: 186000 },
    { tag: "Project: Cerberus", baseCost: 124000 },
    { tag: "CostCenter: 123-A", baseCost: 98000 },
    { tag: "Team: Platform", baseCost: 76000 },
    { tag: "Env: Prod", baseCost: 215000 },
  ]

  // Filter by tags if specified
  let filteredData = baseData
  if (filters.tags && Object.keys(filters.tags).length > 0) {
    filteredData = baseData.filter(item => {
      return Object.entries(filters.tags).some(([, values]) => {
        return values.some(value => item.tag.toLowerCase().includes(value.toLowerCase()))
      })
    })
  }

  return filteredData.map(item => ({
    tag: item.tag,
    cost: Math.floor(item.baseCost * multiplier)
  })).sort((a, b) => a.cost - b.cost).slice(0, role === 'viewer' ? 3 : 5)
}

const chartConfig = {
  cost: { label: "Cost", color: "hsl(var(--chart-1))" },
}

// Component API configuration
const TOP_COST_BY_TAG_API_CONFIG = {
  relevantFilters: ['dateRange', 'tags', 'accounts', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/top-cost-by-tag',
  cacheDuration: 8 * 60 * 1000, // 8 minutes
}

export default function TopCostByTag() {
  const { user } = useAuth()
  const { data: chartData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateTagCostData(filters, user.id, user.role, user.organization)
    },
    TOP_COST_BY_TAG_API_CONFIG.relevantFilters
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cost by Tag</CardTitle>
        <CardDescription>Loading cost breakdown...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cost by Tag</CardTitle>
        <CardDescription>Error loading data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!chartData || chartData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cost by Tag</CardTitle>
        <CardDescription>No tag data available for the selected filters</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Try adjusting your filter settings.</p>
      </CardContent>
    </Card>
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cost by Tag</CardTitle>
        <CardDescription>Grouped by &quot;Project&quot; tag.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="tag" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="cost" layout="vertical" fill="var(--color-cost)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { TOP_COST_BY_TAG_API_CONFIG }
