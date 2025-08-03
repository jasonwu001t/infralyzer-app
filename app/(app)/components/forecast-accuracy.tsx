/**
 * Used by: dashboard, cost-analytics, capacity, ai-insights
 * Purpose: Widget showing forecast accuracy metrics and confidence levels
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface ForecastAccuracyData {
  accuracy: number
  confidence: string
  status: 'excellent' | 'good' | 'poor'
}

const generateForecastAccuracyData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<ForecastAccuracyData> => {
  const baseAccuracy = organization === 'StartupCo' ? 85 : 93
  const roleModifier = role === 'admin' ? 2 : role === 'analyst' ? 1 : 0
  
  const accuracy = Math.min(100, baseAccuracy + roleModifier)
  const status = accuracy >= 95 ? 'excellent' : accuracy >= 85 ? 'good' : 'poor'
  const confidence = accuracy >= 95 ? 'Very High' : accuracy >= 85 ? 'High' : 'Medium'

  return { accuracy, confidence, status }
}

// Component API configuration
const FORECAST_ACCURACY_API_CONFIG = {
  relevantFilters: ['dateRange'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/forecast-accuracy',
  cacheDuration: 15 * 60 * 1000, // 15 minutes
}

export default function ForecastAccuracy() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: forecastData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateForecastAccuracyData(filters, user.id, user.role, user.organization)
    },
    FORECAST_ACCURACY_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Accuracy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[60px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast Accuracy</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!forecastData) return null

  const { accuracy, confidence, status } = forecastData
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${
          status === 'excellent' ? 'text-green-600' : 
          status === 'good' ? 'text-blue-600' : 'text-yellow-600'
        }`}>
          {accuracy}%
        </div>
        <p className="text-xs text-muted-foreground">{confidence} confidence for forecast accuracy</p>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { FORECAST_ACCURACY_API_CONFIG }
