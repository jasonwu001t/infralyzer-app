/**
 * Used by: dashboard, cost-analytics, capacity, ai-insights, optimization
 * Purpose: Real-time anomaly detection feed with AI-detected unusual spending patterns
 */
"use client"

import { AlertTriangle, TrendingUp, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface AnomalyData {
  id: string
  title: string
  severity: 'High' | 'Medium' | 'Low'
  date: string
  service?: string
  region?: string
  impact: number
  description: string
  trend: 'up' | 'down' | 'spike'
  baselinePeriod: string
  percentageChange: number
  recommendation: string
}

const generateAnomalyData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<AnomalyData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allAnomalies = [
    { 
      id: "anom-1", 
      title: "Unusual spike in S3 Data Transfer costs", 
      severity: "High" as const, 
      date: "2024-09-28", 
      service: "Amazon S3", 
      region: "us-east-1", 
      impact: 15000,
      description: "Data transfer costs exceeded baseline by 340% in the last 24 hours",
      trend: "spike" as const,
      baselinePeriod: "7-day average",
      percentageChange: 340,
      recommendation: "Review recent data migration activities and implement CloudFront caching"
    },
    { 
      id: "anom-2", 
      title: "EC2 spend in ap-southeast-2 increased by 40%", 
      severity: "Medium" as const, 
      date: "2024-09-26", 
      service: "Amazon EC2", 
      region: "ap-southeast-2", 
      impact: 8500,
      description: "Regional EC2 costs showing consistent upward trend over 5 days",
      trend: "up" as const,
      baselinePeriod: "30-day average",
      percentageChange: 40,
      recommendation: "Investigate new instance launches and consider Reserved Instance coverage"
    },
    { 
      id: "anom-3", 
      title: "RDS idle instance detected", 
      severity: "Low" as const, 
      date: "2024-09-25", 
      service: "Amazon RDS", 
      region: "us-west-2", 
      impact: 2400,
      description: "Database instance showing <5% CPU utilization for 72+ hours",
      trend: "down" as const,
      baselinePeriod: "Historical usage",
      percentageChange: -95,
      recommendation: "Consider stopping or downsizing unused database instances"
    },
    { 
      id: "anom-4", 
      title: "Lambda invocations surge in us-west-1", 
      severity: "Medium" as const, 
      date: "2024-09-24", 
      service: "AWS Lambda", 
      region: "us-west-1", 
      impact: 5200,
      description: "Function execution count increased 180% causing duration spikes",
      trend: "spike" as const,
      baselinePeriod: "14-day average",
      percentageChange: 180,
      recommendation: "Review function triggers and consider provisioned concurrency"
    },
    { 
      id: "anom-5", 
      title: "DynamoDB read capacity overprovisioned", 
      severity: "Low" as const, 
      date: "2024-09-23", 
      service: "Amazon DynamoDB", 
      region: "us-east-1", 
      impact: 1800,
      description: "Provisioned read capacity exceeding actual usage by 75%",
      trend: "down" as const,
      baselinePeriod: "Monthly usage pattern",
      percentageChange: -75,
      recommendation: "Switch to On-Demand billing or reduce provisioned capacity"
    },
  ]

  let filteredAnomalies = allAnomalies

  // Filter by services if specified
  if (filters.services && filters.services.length > 0) {
    filteredAnomalies = filteredAnomalies.filter(anomaly => 
      filters.services.some(service => anomaly.service?.includes(service))
    )
  }

  // Filter by regions if specified
  if (filters.regions && filters.regions.length > 0) {
    filteredAnomalies = filteredAnomalies.filter(anomaly => 
      filters.regions.includes(anomaly.region || '')
    )
  }

  // Filter by date range
  const startDate = new Date(filters.dateRange.start)
  const endDate = new Date(filters.dateRange.end)
  filteredAnomalies = filteredAnomalies.filter(anomaly => {
    const anomalyDate = new Date(anomaly.date)
    return anomalyDate >= startDate && anomalyDate <= endDate
  })

  return filteredAnomalies.map(anomaly => ({
    ...anomaly,
    impact: Math.floor(anomaly.impact * multiplier)
  })).slice(0, role === 'viewer' ? 2 : role === 'analyst' ? 4 : 5)
}

// Component API configuration
const ANOMALY_FEED_API_CONFIG = {
  relevantFilters: ['dateRange', 'services', 'regions'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/anomalies',
  cacheDuration: 3 * 60 * 1000, // 3 minutes (anomalies need fresher data)
}

export default function AnomalyFeed() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: anomalyData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateAnomalyData(filters, user.id, user.role, user.organization)
    },
    ANOMALY_FEED_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  // Don't fetch data until user is authenticated
  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Anomalies</CardTitle>
        <CardDescription>Loading anomaly detection...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-muted mt-2"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Anomalies</CardTitle>
        <CardDescription>AI-detected unusual spending.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1 h-5 w-5 animate-pulse rounded bg-muted"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted"></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Anomalies</CardTitle>
        <CardDescription>AI-detected unusual spending.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!anomalyData || anomalyData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Anomalies</CardTitle>
        <CardDescription>AI-detected unusual spending.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No anomalies detected in the selected time range.</p>
      </CardContent>
    </Card>
  )

  const totalFinancialImpact = anomalyData.reduce((sum, item) => sum + Math.abs(item.impact), 0)
  const highSeverityCount = anomalyData.filter(item => item.severity === 'High').length

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingUp className="h-3 w-3 text-green-500 transform rotate-180" />
      case 'spike': return <AlertTriangle className="h-3 w-3 text-orange-500" />
      default: return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive'
      case 'Medium': return 'secondary'
      case 'Low': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Cost Anomaly Detection</span>
          <div className="flex gap-2">
            {highSeverityCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {highSeverityCount} Critical
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              ${totalFinancialImpact.toLocaleString()} impact
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          AI-powered detection of unusual spending patterns and optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {anomalyData.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 space-y-3">
            {/* Header Row */}
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`mt-1 h-4 w-4 flex-shrink-0 ${
                  item.severity === "High"
                    ? "text-red-500"
                    : item.severity === "Medium"
                      ? "text-yellow-500"
                      : "text-blue-500"
                }`}
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant={getSeverityColor(item.severity)} className="text-xs">
                    {item.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Impact:</span>
                <span className="font-medium">${item.impact.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(item.trend)}
                <span className="text-muted-foreground">Change:</span>
                <span className={`font-medium ${item.percentageChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {item.percentageChange > 0 ? '+' : ''}{item.percentageChange}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">vs:</span>
                <span className="font-medium">{item.baselinePeriod}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{item.date}</span>
              </div>
            </div>

            {/* Service & Region Info */}
            <div className="flex items-center gap-4 text-xs">
              {item.service && (
                <div>
                  <span className="text-muted-foreground">Service:</span>
                  <span className="ml-1 font-medium">{item.service}</span>
                </div>
              )}
              {item.region && (
                <div>
                  <span className="text-muted-foreground">Region:</span>
                  <span className="ml-1 font-medium">{item.region}</span>
                </div>
              )}
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 p-2 rounded text-xs">
              <div className="text-blue-700 font-medium mb-1">Recommended Action:</div>
              <div className="text-blue-600">{item.recommendation}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { ANOMALY_FEED_API_CONFIG }
