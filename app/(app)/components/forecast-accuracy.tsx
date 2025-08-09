/**
 * Used by: dashboard, cost-analytics, capacity, ai-insights
 * Purpose: Widget showing forecast accuracy metrics and confidence levels
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Info, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface ForecastAccuracyData {
  accuracy: number
  confidence: string
  status: 'excellent' | 'good' | 'poor'
  lastUpdated: string
  dataPoints: number
  forecastPeriod: string
  methodology: string
  meanAbsoluteError: number
  actualVsPredicted: Array<{ period: string; actual: number; predicted: number; accuracy: number }>
}

const generateForecastAccuracyData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<ForecastAccuracyData> => {
  const baseAccuracy = organization === 'StartupCo' ? 85 : 93
  const roleModifier = role === 'admin' ? 2 : role === 'analyst' ? 1 : 0
  
  const accuracy = Math.min(100, baseAccuracy + roleModifier)
  const status = accuracy >= 95 ? 'excellent' : accuracy >= 85 ? 'good' : 'poor'
  const confidence = accuracy >= 95 ? 'Very High' : accuracy >= 85 ? 'High' : 'Medium'

  // Generate mock historical data for accuracy calculation
  const actualVsPredicted = [
    { period: 'Jan 2024', actual: 125000, predicted: 128000, accuracy: 97.7 },
    { period: 'Feb 2024', actual: 132000, predicted: 129000, accuracy: 97.7 },
    { period: 'Mar 2024', actual: 118000, predicted: 115000, accuracy: 97.5 },
    { period: 'Apr 2024', actual: 145000, predicted: 148000, accuracy: 97.9 },
    { period: 'May 2024', actual: 139000, predicted: 142000, accuracy: 97.8 },
    { period: 'Jun 2024', actual: 156000, predicted: 152000, accuracy: 97.4 }
  ]

  return { 
    accuracy, 
    confidence, 
    status,
    lastUpdated: new Date().toISOString().split('T')[0],
    dataPoints: 180, // 6 months of daily data
    forecastPeriod: '30-day rolling',
    methodology: 'Ensemble ML (ARIMA + Random Forest + Neural Network)',
    meanAbsoluteError: Math.round((100 - accuracy) * 1000),
    actualVsPredicted
  }
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

  const { accuracy, confidence, status, lastUpdated, dataPoints, forecastPeriod, methodology, meanAbsoluteError, actualVsPredicted } = forecastData
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`h-4 w-4 ${
              status === 'excellent' ? 'text-green-600' : 
              status === 'good' ? 'text-blue-600' : 'text-yellow-600'
            }`} />
            <span>Forecast Accuracy</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1 hover:bg-muted rounded">
                <Info className="h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-3">
                <div className="font-medium text-sm">How Accuracy is Calculated</div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Methodology:</span>
                    <div className="text-muted-foreground">{methodology}</div>
                  </div>
                  <div>
                    <span className="font-medium">Data Points:</span>
                    <div className="text-muted-foreground">{dataPoints} historical observations</div>
                  </div>
                  <div>
                    <span className="font-medium">Forecast Period:</span>
                    <div className="text-muted-foreground">{forecastPeriod} predictions</div>
                  </div>
                  <div>
                    <span className="font-medium">Calculation:</span>
                    <div className="text-muted-foreground">
                      100% - (Mean Absolute Percentage Error)
                      <br />
                      MAPE = Average(|Actual - Predicted| / Actual) × 100%
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Mean Absolute Error:</span>
                    <div className="text-muted-foreground">${meanAbsoluteError.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${
              status === 'excellent' ? 'text-green-600' : 
              status === 'good' ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              {accuracy}%
            </div>
            <div className="text-xs text-muted-foreground">Current Accuracy</div>
          </div>
          <div className="space-y-1">
            <Badge variant={
              status === 'excellent' ? 'default' : 
              status === 'good' ? 'secondary' : 'outline'
            } className="text-xs">
              {confidence}
            </Badge>
            <div className="text-xs text-muted-foreground">Confidence Level</div>
          </div>
        </div>

        {/* Forecast Details */}
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Last Updated:</span>
            <span className="font-medium">{lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Forecast Window:</span>
            <span className="font-medium">{forecastPeriod}</span>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Recent Performance:</div>
          <div className="space-y-1">
            {actualVsPredicted.slice(-3).map((item) => (
              <div key={item.period} className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{item.period}:</span>
                <div className="flex items-center gap-2">
                  <span>Actual: ${item.actual.toLocaleString()}</span>
                  <span>Predicted: ${item.predicted.toLocaleString()}</span>
                  <Badge 
                    variant={item.accuracy >= 97 ? 'default' : item.accuracy >= 95 ? 'secondary' : 'outline'} 
                    className="text-xs px-1"
                  >
                    {item.accuracy.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className={`p-2 rounded text-xs ${
          status === 'excellent' ? 'bg-green-50 text-green-700' : 
          status === 'good' ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          <div className="font-medium">
            {status === 'excellent' ? '✓ Excellent Forecast Quality' : 
             status === 'good' ? '○ Good Forecast Quality' : 
             '△ Forecast Quality Needs Improvement'}
          </div>
          <div className="mt-1">
            {status === 'excellent' ? 'Forecasts are highly reliable for planning decisions' : 
             status === 'good' ? 'Forecasts are suitable for most planning purposes' : 
             'Consider additional data sources to improve accuracy'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { FORECAST_ACCURACY_API_CONFIG }
