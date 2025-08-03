/**
 * Used by: dashboard, cost-analytics, capacity
 * Purpose: Displays KPI metrics with user-aware data scaling and trend indicators
 */
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, DollarSign, TrendingUp, TrendingDown, CalendarDays, Loader2 } from 'lucide-react'
import { useDashboardFilters, DashboardFilters } from '@/lib/hooks/use-dashboard-filters'
import { useAuth } from '@/lib/hooks/use-auth'

// Icon mapping for React 19 compatibility
const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CalendarDays,
}

// Component-specific API data structure
export interface KpiData {
  id: string
  title: string
  value: number
  displayValue: string
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  trend: string
  icon: string
  category: 'cost' | 'usage' | 'efficiency' | 'savings'
  metadata: {
    unit: 'currency' | 'percentage' | 'count'
    format: 'compact' | 'full'
    lastUpdated: string
  }
}

// Component API configuration
const KPI_API_CONFIG = {
  // Which filters affect this component's data
  relevantFilters: ['dateRange', 'accounts', 'services'] as (keyof DashboardFilters)[],
  
  // Cache duration in milliseconds
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  
  // Real API endpoint (when ready to replace demo data)
  endpoint: '/api/dashboard/kpis',
  
  // Demo data generator
  generateDemoData: (filters: DashboardFilters, user: any): KpiData[] => {
    const orgMultiplier = user?.organization === 'StartupCo' ? 0.3 : 1
    const roleMultiplier = user?.role === 'admin' ? 1 : user?.role === 'analyst' ? 0.8 : 0.6
    const baseMultiplier = orgMultiplier * roleMultiplier

    const baseValue = 1250430 * baseMultiplier
    const previousValue = 1180250 * baseMultiplier
    const change = ((baseValue - previousValue) / previousValue) * 100

    return [
      {
        id: 'mtd-spend',
        title: 'Month-to-Date Spend',
        value: baseValue,
        displayValue: `$${baseValue.toLocaleString()}`,
        previousValue,
        change: Math.round(change * 10) / 10,
        changeType: change > 0 ? 'increase' as const : 'decrease' as const,
        trend: `${change > 0 ? '+' : ''}${Math.round(change * 10) / 10}% vs last month`,
        icon: 'DollarSign',
        category: 'cost' as const,
        metadata: {
          unit: 'currency',
          format: 'compact',
          lastUpdated: new Date().toISOString()
        }
      },
      {
        id: 'forecast',
        title: 'Monthly Forecast',
        value: 2450800 * baseMultiplier,
        displayValue: `$${(2450800 * baseMultiplier).toLocaleString()}`,
        previousValue: 2354210 * baseMultiplier,
        change: 4.1,
        changeType: 'increase' as const,
        trend: '+4.1% vs last month',
        icon: 'TrendingUp',
        category: 'cost' as const,
        metadata: {
          unit: 'currency',
          format: 'compact',
          lastUpdated: new Date().toISOString()
        }
      },
      {
        id: 'savings',
        title: 'YTD Savings',
        value: 186420 * baseMultiplier,
        displayValue: `$${(186420 * baseMultiplier).toLocaleString()}`,
        previousValue: 142350 * baseMultiplier,
        change: 31.0,
        changeType: 'increase' as const,
        trend: '+31.0% vs last year',
        icon: 'TrendingUp',
        category: 'savings' as const,
        metadata: {
          unit: 'currency',
          format: 'compact',
          lastUpdated: new Date().toISOString()
        }
      }
    ]
  }
}

interface KpiCardProps {
  kpiId?: string // Optional: specific KPI to display
  title?: string // Override title
  value?: string // Override value (for backward compatibility)
  trend?: string // Override trend (for backward compatibility)
  icon?: string  // Override icon (for backward compatibility)
  showTrend?: boolean // Show/hide trend
  compact?: boolean // Compact display mode
}

export default function KpiCard({ 
  kpiId, 
  title: titleOverride, 
  value: valueOverride, 
  trend: trendOverride, 
  icon: iconOverride,
  showTrend = true, 
  compact = false 
}: KpiCardProps) {
  const { user } = useAuth()
  const { filters } = useDashboardFilters()
  const [kpiData, setKpiData] = useState<KpiData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch KPI data based on filters
  useEffect(() => {
    const fetchKpiData = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Generate demo data (replace with real API call)
        // TODO: Replace with actual API call when ready
        // const response = await fetch(KPI_API_CONFIG.endpoint, {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(filterUtils.toQueryParams(filters))
        // })
        // const data = await response.json()
        
        const data = KPI_API_CONFIG.generateDemoData(filters, user)
        setKpiData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load KPI data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchKpiData()
  }, [filters, user])

  // Support backward compatibility with direct props
  if (titleOverride && valueOverride) {
    const IconComponent = iconMap[iconOverride || 'DollarSign'] || DollarSign
    const isPositive = trendOverride?.startsWith("+")
    const isNegative = trendOverride?.startsWith("-")

    return (
      <Card className={compact ? 'h-24' : ''}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{titleOverride}</CardTitle>
          <IconComponent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{valueOverride}</div>
          {showTrend && trendOverride && (
            <p className={`text-xs ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"}`}>
              {trendOverride}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // Get specific KPI or first one
  const kpi = kpiId ? kpiData.find(k => k.id === kpiId) : kpiData[0]
  
  if (!kpi) {
    return (
      <Card className={compact ? 'h-24' : ''}>
        <CardContent className="flex items-center justify-center h-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="text-sm text-muted-foreground">No data available</span>
          )}
        </CardContent>
      </Card>
    )
  }

  const IconComponent = iconMap[kpi.icon] || DollarSign
  const isPositive = kpi.changeType === 'increase'
  const isNegative = kpi.changeType === 'decrease'

  return (
    <Card className={compact ? 'h-24' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titleOverride || kpi.title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.displayValue}</div>
        {showTrend && (
          <p className={`text-xs ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"}`}>
            {kpi.trend}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 mt-1">Error: {error}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Export the API configuration for documentation
export { KPI_API_CONFIG }