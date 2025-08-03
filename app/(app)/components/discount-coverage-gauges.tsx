/**
 * Used by: dashboard, cost-analytics, optimization, discounts
 * Purpose: Gauge charts showing discount coverage percentages for savings plans and RIs
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface DiscountCoverageData {
  riData: { name: string; value: number; fill: string }[]
  spData: { name: string; value: number; fill: string }[]
  riPercentage: number
  spPercentage: number
}

const generateDiscountCoverageData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<DiscountCoverageData> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.8 : 1 // Startups typically have lower RI/SP coverage
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.95 : 0.9

  const riPercentage = Math.floor(92 * baseMultiplier * roleMultiplier)
  const spPercentage = Math.floor(78 * baseMultiplier * roleMultiplier)

  return {
    riData: [{ name: "ri", value: riPercentage, fill: "var(--color-ri)" }],
    spData: [{ name: "sp", value: spPercentage, fill: "var(--color-sp)" }],
    riPercentage,
    spPercentage
  }
}

const chartConfig = {
  value: { label: "Value" },
  ri: { label: "RI Utilization", color: "hsl(var(--chart-1))" },
  sp: { label: "SP Coverage", color: "hsl(var(--chart-2))" },
}

// Component API configuration
const DISCOUNT_COVERAGE_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/discount-coverage',
  cacheDuration: 10 * 60 * 1000, // 10 minutes
}

export default function DiscountCoverageGauges() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: coverageData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateDiscountCoverageData(filters, user.id, user.role, user.organization)
    },
    DISCOUNT_COVERAGE_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!coverageData) return null

  const { riData, spData, riPercentage, spPercentage } = coverageData
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <ResponsiveContainer>
                <RadialBarChart data={riData} startAngle={-270} endAngle={90} innerRadius={60} barSize={20}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm font-medium">RI Utilization: {riPercentage}%</p>
          </div>
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <ResponsiveContainer>
                <RadialBarChart data={spData} startAngle={-270} endAngle={90} innerRadius={60} barSize={20}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm font-medium">SP Coverage: {spPercentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { DISCOUNT_COVERAGE_API_CONFIG }
