/**
 * Used by: dashboard, cost-analytics, capacity, allocation
 * Purpose: Shows cost distribution across AWS regions with progress indicators
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface RegionalData {
  region: string
  cost: number
  percentage: number
}

const generateRegionalData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<RegionalData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allRegions = [
    { region: "us-east-1", baseCost: 550000, basePercentage: 44 },
    { region: "us-west-2", baseCost: 320000, basePercentage: 26 },
    { region: "eu-west-1", baseCost: 180000, basePercentage: 14 },
    { region: "ap-southeast-2", baseCost: 110000, basePercentage: 9 },
    { region: "Other", baseCost: 90430, basePercentage: 7 },
  ]

  // Filter by regions if specified
  let filteredRegions = allRegions
  if (filters.regions && filters.regions.length > 0) {
    filteredRegions = allRegions.filter(region => 
      filters.regions.includes(region.region) || region.region === 'Other'
    )
  }

  const totalCost = filteredRegions.reduce((sum, region) => sum + (region.baseCost * multiplier), 0)

  return filteredRegions.map(region => {
    const cost = Math.floor(region.baseCost * multiplier)
    const percentage = Math.round((cost / totalCost) * 100)
    return {
      region: region.region,
      cost,
      percentage
    }
  }).slice(0, role === 'viewer' ? 3 : 5)
}

// Component API configuration
const REGIONAL_COST_API_CONFIG = {
  relevantFilters: ['dateRange', 'regions', 'accounts', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/regional-costs',
  cacheDuration: 8 * 60 * 1000, // 8 minutes
}

export default function RegionalCostBreakdown() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: regionalData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateRegionalData(filters, user.id, user.role, user.organization)
    },
    REGIONAL_COST_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  // Don't fetch data until user is authenticated
  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Region</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              </div>
              <div className="h-2 w-full animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Region</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              </div>
              <div className="h-2 w-full animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Region</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!regionalData || regionalData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Region</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No regional data available for the selected filters.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Region</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {regionalData.map((item) => (
          <div key={item.region}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.region}</span>
              <span className="text-muted-foreground">${item.cost.toLocaleString()}</span>
            </div>
            <Progress value={item.percentage} className="mt-1 h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { REGIONAL_COST_API_CONFIG }
