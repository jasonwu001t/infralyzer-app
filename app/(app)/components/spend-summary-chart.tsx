/**
 * Used by: dashboard, cost-analytics
 * Purpose: Month-to-date spend chart with forecast and budget comparison
 */
"use client"

import { useState, useEffect } from 'react'
import {
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import { useDashboardFilters, DashboardFilters } from '@/lib/hooks/use-dashboard-filters'
import { useAuth } from '@/lib/hooks/use-auth'

// Component-specific API data structure
export interface SpendChartData {
  date: string
  current: number
  previous: number
  forecast: number
  budget: number
  metadata: {
    isWeekend: boolean
    hasAnomalies: boolean
    confidence: number
  }
}

export interface SpendSummaryData {
  chartData: SpendChartData[]
  summary: {
    totalSpend: number
    budgetUtilization: number
    forecastVariance: number
    trend: 'up' | 'down' | 'stable'
    periodComparison: number
  }
  insights: {
    topSpendDay: string
    lowestSpendDay: string
    averageDailySpend: number
    remainingBudget: number
  }
  metadata: {
    dateRange: {
      start: string
      end: string
    }
    granularity: 'daily' | 'weekly' | 'monthly'
    currency: string
    lastUpdated: string
  }
}

// Component API configuration
const SPEND_CHART_API_CONFIG = {
  // Which filters affect this component's data
  relevantFilters: ['dateRange', 'accounts', 'services', 'granularity'] as (keyof DashboardFilters)[],
  
  // Cache duration in milliseconds
  cacheDuration: 2 * 60 * 1000, // 2 minutes (more frequent for financial data)
  
  // Real API endpoint (when ready to replace demo data)
  endpoint: '/api/dashboard/spend-summary',
  
  // Demo data generator
  generateDemoData: (filters: DashboardFilters, user: any): SpendSummaryData => {
    const orgMultiplier = user?.organization === 'StartupCo' ? 0.3 : 1
    const roleMultiplier = user?.role === 'admin' ? 1 : user?.role === 'analyst' ? 0.8 : 0.6
    const baseMultiplier = orgMultiplier * roleMultiplier
    
    // Generate time series data based on granularity
    const granularity = filters.granularity || 'daily'
    const dataPoints = granularity === 'daily' ? 30 : granularity === 'weekly' ? 12 : 6
    
    const baseAmount = 80 * baseMultiplier
    const budget = 85 * baseMultiplier
    
    const chartData: SpendChartData[] = Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date()
      if (granularity === 'daily') {
        date.setDate(date.getDate() - (dataPoints - 1 - i))
      } else if (granularity === 'weekly') {
        date.setDate(date.getDate() - (dataPoints - 1 - i) * 7)
      } else {
        date.setMonth(date.getMonth() - (dataPoints - 1 - i))
      }
      
      const isWeekend = granularity === 'daily' && (date.getDay() === 0 || date.getDay() === 6)
      const weekendMultiplier = isWeekend ? 0.7 : 1
      const variance = 0.8 + Math.random() * 0.4 // ±20% variance
      
      const current = Math.round(baseAmount * variance * weekendMultiplier)
      const previous = Math.round(baseAmount * 0.9 * variance * weekendMultiplier)
      const forecast = Math.round(baseAmount * 1.05 * variance)
      
      return {
        date: granularity === 'daily' 
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : granularity === 'weekly'
          ? `W${Math.ceil(date.getDate() / 7)}`
          : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        current,
        previous,
        forecast,
        budget,
        metadata: {
          isWeekend,
          hasAnomalies: Math.random() > 0.85,
          confidence: 0.85 + Math.random() * 0.1
        }
      }
    })
    
    // Calculate summary metrics
    const totalSpend = chartData.reduce((sum, day) => sum + day.current, 0)
    const totalPrevious = chartData.reduce((sum, day) => sum + day.previous, 0)
    const totalForecast = chartData.reduce((sum, day) => sum + day.forecast, 0)
    const totalBudget = budget * dataPoints
    
    const budgetUtilization = (totalSpend / totalBudget) * 100
    const forecastVariance = ((totalForecast - totalSpend) / totalSpend) * 100
    const periodComparison = ((totalSpend - totalPrevious) / totalPrevious) * 100
    
    const trend = periodComparison > 5 ? 'up' : periodComparison < -5 ? 'down' : 'stable'
    
    // Find insights
    const maxSpendDay = chartData.reduce((max, day) => day.current > max.current ? day : max)
    const minSpendDay = chartData.reduce((min, day) => day.current < min.current ? day : min)
    const averageDailySpend = totalSpend / chartData.length
    const remainingBudget = totalBudget - totalSpend
    
    return {
      chartData,
      summary: {
        totalSpend: Math.round(totalSpend),
        budgetUtilization: Math.round(budgetUtilization * 10) / 10,
        forecastVariance: Math.round(forecastVariance * 10) / 10,
        trend,
        periodComparison: Math.round(periodComparison * 10) / 10
      },
      insights: {
        topSpendDay: maxSpendDay.date,
        lowestSpendDay: minSpendDay.date,
        averageDailySpend: Math.round(averageDailySpend),
        remainingBudget: Math.round(remainingBudget)
      },
      metadata: {
        dateRange: {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        },
        granularity,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      }
    }
  }
}

const chartConfig = {
  current: { label: "Current Spend", color: "hsl(var(--chart-1))" },
  previous: { label: "Previous Period", color: "hsl(var(--chart-2))" },
  forecast: { label: "Forecast", color: "hsl(var(--chart-3))" },
  budget: { label: "Budget", color: "hsl(var(--destructive))" },
}

interface SpendSummaryChartProps {
  showInsights?: boolean
  compact?: boolean
  title?: string
  description?: string
}

export default function SpendSummaryChart({ 
  showInsights = true, 
  compact = false,
  title = "Month to Date Spend",
  description = "Daily spend compared to previous period, forecast, and budget."
}: SpendSummaryChartProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { filters, isLoading: filtersLoading } = useDashboardFilters()
  const [spendData, setSpendData] = useState<SpendSummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch spend data based on filters
  useEffect(() => {
    const fetchSpendData = async () => {
      if (!user || !isAuthenticated || filtersLoading || authLoading) return

      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Generate demo data (replace with real API call)
        // TODO: Replace with actual API call when ready
        // const queryParams = filterUtils.toQueryParams(filters)
        // const response = await fetch(`${SPEND_CHART_API_CONFIG.endpoint}?${new URLSearchParams(queryParams)}`)
        // const data = await response.json()
        
        const data = SPEND_CHART_API_CONFIG.generateDemoData(filters, user)
        setSpendData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load spend data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpendData()
  }, [filters, user, isAuthenticated, filtersLoading, authLoading])

  if (!spendData) {
    return (
      <Card className={compact ? "h-64" : "lg:col-span-2"}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          {(isLoading || authLoading || !isAuthenticated) ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading spend data...</span>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-red-500">{error}</p>
              <button 
                className="text-xs text-blue-500 hover:underline mt-1"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No data available</span>
          )}
        </CardContent>
      </Card>
    )
  }

  const TrendIcon = spendData.summary.trend === 'up' ? TrendingUp : TrendingDown
  const trendColor = spendData.summary.trend === 'up' ? 'text-red-500' : 
                    spendData.summary.trend === 'down' ? 'text-green-500' : 'text-muted-foreground'

  return (
    <Card className={compact ? "h-64" : "lg:col-span-2"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showInsights && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                <span className={trendColor}>
                  {spendData.summary.periodComparison > 0 ? '+' : ''}
                  {spendData.summary.periodComparison}%
                </span>
              </div>
              <div className="text-muted-foreground">
                Budget: {spendData.summary.budgetUtilization}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className={compact ? "h-48" : "h-[350px]"}>
          <ResponsiveContainer>
            <ComposedChart 
              data={spendData.chartData} 
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}k`} 
                tickLine={false} 
                axisLine={false}
                fontSize={12}
              />
              <Tooltip 
                cursor={false} 
                content={<ChartTooltipContent indicator="dot" hideLabel />} 
              />
              {!compact && <Legend />}
              <ReferenceLine
                y={spendData.chartData[0]?.budget || 85}
                label={!compact ? { value: "Budget", position: "insideTopLeft" } : undefined}
                stroke="var(--color-budget)"
                strokeDasharray="3 3"
                strokeWidth={2}
              />
              <Bar 
                dataKey="current" 
                fill="var(--color-current)" 
                radius={4}
                name="Current Spend"
              />
              <Line 
                type="monotone" 
                dataKey="previous" 
                stroke="var(--color-previous)" 
                strokeWidth={2} 
                dot={false}
                name="Previous Period"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--color-forecast)"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {showInsights && !compact && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">${spendData.insights.averageDailySpend}k</p>
              <p className="text-xs text-muted-foreground">Avg Daily</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">${spendData.insights.remainingBudget}k</p>
              <p className="text-xs text-muted-foreground">Remaining Budget</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{spendData.insights.topSpendDay}</p>
              <p className="text-xs text-muted-foreground">Top Spend Day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{spendData.summary.forecastVariance}%</p>
              <p className="text-xs text-muted-foreground">Forecast Variance</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export the API configuration for documentation
export { SPEND_CHART_API_CONFIG }