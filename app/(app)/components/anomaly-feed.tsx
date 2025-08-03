/**
 * Used by: dashboard, cost-analytics, capacity, ai-insights, optimization
 * Purpose: Real-time anomaly detection feed with AI-detected unusual spending patterns
 */
"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}

const generateAnomalyData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<AnomalyData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allAnomalies = [
    { id: "anom-1", title: "Unusual spike in S3 Data Transfer costs", severity: "High" as const, date: "2024-09-28", service: "Amazon S3", region: "us-east-1", impact: 15000 },
    { id: "anom-2", title: "EC2 spend in ap-southeast-2 increased by 40%", severity: "Medium" as const, date: "2024-09-26", service: "Amazon EC2", region: "ap-southeast-2", impact: 8500 },
    { id: "anom-3", title: "RDS idle instance detected", severity: "Low" as const, date: "2024-09-25", service: "Amazon RDS", region: "us-west-2", impact: 2400 },
    { id: "anom-4", title: "Lambda invocations surge in us-west-1", severity: "Medium" as const, date: "2024-09-24", service: "AWS Lambda", region: "us-west-1", impact: 5200 },
    { id: "anom-5", title: "DynamoDB read capacity overprovisioned", severity: "Low" as const, date: "2024-09-23", service: "Amazon DynamoDB", region: "us-east-1", impact: 1800 },
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
  const { user } = useAuth()
  const { data: anomalyData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateAnomalyData(filters, user.id, user.role, user.organization)
    },
    ANOMALY_FEED_API_CONFIG.relevantFilters
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Anomalies</CardTitle>
        <CardDescription>AI-detected unusual spending.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {anomalyData.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <AlertTriangle
              className={`mt-1 h-5 w-5 flex-shrink-0 ${
                item.severity === "High"
                  ? "text-red-500"
                  : item.severity === "Medium"
                    ? "text-yellow-500"
                    : "text-blue-500"
              }`}
            />
            <div className="flex-grow">
              <p className="text-sm font-medium">{item.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.date}</span>
                {item.service && <span>• {item.service}</span>}
                {item.region && <span>• {item.region}</span>}
                <span>• Impact: ${item.impact.toLocaleString()}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { ANOMALY_FEED_API_CONFIG }
