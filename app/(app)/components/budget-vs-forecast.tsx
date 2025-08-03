/**
 * Used by: dashboard, cost-analytics
 * Purpose: Budget vs forecast comparison with overage indicators and status tracking
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface BudgetForecastData {
  budget: number
  forecast: number
  progress: number
  overage: number
  status: 'on-track' | 'warning' | 'over-budget'
}

const generateBudgetForecastData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<BudgetForecastData> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const budget = Math.floor(2400000 * multiplier)
  const forecast = Math.floor(2450800 * multiplier)
  const progress = (forecast / budget) * 100
  const overage = forecast - budget

  return {
    budget,
    forecast,
    progress,
    overage,
    status: progress > 100 ? 'over-budget' : progress > 95 ? 'warning' : 'on-track'
  }
}

// Component API configuration
const BUDGET_FORECAST_API_CONFIG = {
  relevantFilters: ['dateRange'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/budget-forecast',
  cacheDuration: 10 * 60 * 1000, // 10 minutes
}

export default function BudgetVsForecast() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: budgetData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateBudgetForecastData(filters, user.id, user.role, user.organization)
    },
    BUDGET_FORECAST_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency to prevent premature fetching
  )

  // Don't fetch data until user is authenticated
  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Forecast</CardTitle>
        <CardDescription>Loading...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[100px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Forecast</CardTitle>
        <CardDescription>Loading...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[100px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Forecast</CardTitle>
        <CardDescription>Error loading data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!budgetData) return null

  const { budget, forecast, progress, overage } = budgetData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Forecast</CardTitle>
        <CardDescription>Projected month-end spend.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Forecast: ${forecast.toLocaleString()}</span>
          <span className="text-muted-foreground">Budget: ${budget.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className={`text-center text-sm font-medium ${
          budgetData.status === 'over-budget' ? 'text-red-500' : 
          budgetData.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {overage > 0 ? `Projected Overage: $${overage.toLocaleString()}` : `Under Budget: $${Math.abs(overage).toLocaleString()}`}
        </div>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { BUDGET_FORECAST_API_CONFIG }
