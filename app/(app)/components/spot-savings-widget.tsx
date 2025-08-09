"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BadgePercent, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface SpotMetrics {
  monthlySavings: number
  savingsPercentage: number
  spotUsageHours: number
  interruptionRate: number
  activeInstances: number
  averageDiscount: number
  weeklyTrend: number
  availabilityZones: number
}

export default function SpotSavingsWidget() {
  // Mock data - in real app this would come from API
  const metrics: SpotMetrics = {
    monthlySavings: 125430,
    savingsPercentage: 67,
    spotUsageHours: 8760,
    interruptionRate: 2.3,
    activeInstances: 45,
    averageDiscount: 67,
    weeklyTrend: 8.5,
    availabilityZones: 3
  }

  const trendUp = metrics.weeklyTrend > 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <BadgePercent className="h-4 w-4 text-orange-600" />
            <span>Spot Instance Management</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {metrics.activeInstances} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">
              ${metrics.monthlySavings.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Monthly Savings</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{metrics.savingsPercentage}%</div>
            <div className="text-xs text-muted-foreground">vs On-Demand</div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
          {trendUp ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(metrics.weeklyTrend)}% {trendUp ? 'increase' : 'decrease'} this week
          </span>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Average Discount</span>
              <span className="font-medium">{metrics.averageDiscount}%</span>
            </div>
            <Progress value={metrics.averageDiscount} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Usage Hours:</span>
              <span className="font-medium">{metrics.spotUsageHours.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AZ Coverage:</span>
              <span className="font-medium">{metrics.availabilityZones} zones</span>
            </div>
          </div>

          {/* Interruption Rate Alert */}
          <div className={`flex items-center gap-2 p-2 rounded text-xs ${
            metrics.interruptionRate > 5 ? 'bg-red-50 text-red-700' : 
            metrics.interruptionRate > 2 ? 'bg-yellow-50 text-yellow-700' : 
            'bg-green-50 text-green-700'
          }`}>
            <AlertTriangle className="h-3 w-3" />
            <span>
              {metrics.interruptionRate}% interruption rate
              {metrics.interruptionRate > 5 ? ' (High)' : 
               metrics.interruptionRate > 2 ? ' (Moderate)' : ' (Low)'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">Optimization Tips:</div>
          <div className="space-y-1 text-xs">
            {metrics.interruptionRate > 3 && (
              <div className="text-orange-600">• Consider diversifying across more AZs</div>
            )}
            {metrics.averageDiscount < 60 && (
              <div className="text-blue-600">• Explore additional instance types for better savings</div>
            )}
            <div className="text-green-600">• Current strategy performing well</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
