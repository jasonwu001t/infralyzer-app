/**
 * Used by: dashboard, cost-analytics, capacity, allocation
 * Purpose: Advanced table showing service costs with filtering, search, and trend visualization
 */
"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { Search, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react'
import { useDashboardFilters, DashboardFilters } from '@/lib/hooks/use-dashboard-filters'
import { useAuth } from '@/lib/hooks/use-auth'

// Component-specific API data structure
export interface ServiceCostData {
  serviceId: string
  serviceName: string
  displayName: string
  category: 'compute' | 'storage' | 'database' | 'networking' | 'analytics' | 'security' | 'other'
  cost: {
    current: number
    previous: number
    change: number
    changePercent: number
  }
  trend: {
    data: number[]
    direction: 'up' | 'down' | 'stable'
    confidence: number
  }
  usage: {
    current: number
    unit: string
    efficiency: number
  }
  accounts: string[]
  regions: string[]
  metadata: {
    instanceCount?: number
    avgInstanceCost?: number
    utilizationRate?: number
    lastOptimized?: string
    tags: Record<string, string>
  }
}

export interface ServiceCostsTableData {
  services: ServiceCostData[]
  summary: {
    totalCost: number
    totalServices: number
    avgCostPerService: number
    topCostCategories: Array<{
      category: string
      cost: number
      percentage: number
    }>
  }
  filters: {
    appliedFilters: string[]
    availableCategories: string[]
    costRange: { min: number; max: number }
  }
  metadata: {
    dateRange: { start: string; end: string }
    lastUpdated: string
    currency: string
  }
}

// Component API configuration
const SERVICE_COSTS_API_CONFIG = {
  // Which filters affect this component's data
  relevantFilters: ['dateRange', 'services', 'accounts', 'regions', 'costTypes'] as (keyof DashboardFilters)[],
  
  // Cache duration in milliseconds
  cacheDuration: 3 * 60 * 1000, // 3 minutes
  
  // Real API endpoint (when ready to replace demo data)
  endpoint: '/api/dashboard/service-costs',
  
  // Demo data generator
  generateDemoData: (filters: DashboardFilters, user: any): ServiceCostsTableData => {
    const orgMultiplier = user?.organization === 'StartupCo' ? 0.3 : 1
    const roleMultiplier = user?.role === 'admin' ? 1 : user?.role === 'analyst' ? 0.8 : 0.6
    const baseMultiplier = orgMultiplier * roleMultiplier

    const serviceTypes = [
      { id: 'ec2', name: 'Amazon EC2', display: 'EC2 - Elastic Compute Cloud', category: 'compute' as const, baseCost: 450000 },
      { id: 'rds', name: 'Amazon RDS', display: 'RDS - Relational Database', category: 'database' as const, baseCost: 210000 },
      { id: 's3', name: 'Amazon S3', display: 'S3 - Simple Storage Service', category: 'storage' as const, baseCost: 150000 },
      { id: 'lambda', name: 'AWS Lambda', display: 'Lambda - Serverless Compute', category: 'compute' as const, baseCost: 95000 },
      { id: 'cloudfront', name: 'Amazon CloudFront', display: 'CloudFront - Content Delivery', category: 'networking' as const, baseCost: 85000 },
      { id: 'ebs', name: 'Amazon EBS', display: 'EBS - Block Storage', category: 'storage' as const, baseCost: 75000 },
      { id: 'route53', name: 'Amazon Route 53', display: 'Route 53 - DNS Service', category: 'networking' as const, baseCost: 25000 },
      { id: 'cloudwatch', name: 'Amazon CloudWatch', display: 'CloudWatch - Monitoring', category: 'analytics' as const, baseCost: 35000 }
    ]

    // Filter services based on applied filters
    let filteredServices = serviceTypes
    if (filters.services.length > 0) {
      filteredServices = serviceTypes.filter(service => 
        filters.services.some(filterService => 
          service.name.toLowerCase().includes(filterService.toLowerCase()) ||
          service.display.toLowerCase().includes(filterService.toLowerCase())
        )
      )
    }

    const services: ServiceCostData[] = filteredServices.map(service => {
      const current = service.baseCost * baseMultiplier * (0.8 + Math.random() * 0.4)
      const previous = current * (0.85 + Math.random() * 0.3)
      const change = current - previous
      const changePercent = (change / previous) * 100
      
      // Generate 7-day trend data
      const trendData = Array.from({ length: 7 }, () => {
        const variance = 0.9 + Math.random() * 0.2
        return Math.round(current * variance / 1000) // Convert to thousands for chart
      })
      
      const trendDirection = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable'

      return {
        serviceId: service.id,
        serviceName: service.name,
        displayName: service.display,
        category: service.category,
        cost: {
          current: Math.round(current),
          previous: Math.round(previous),
          change: Math.round(change),
          changePercent: Math.round(changePercent * 10) / 10
        },
        trend: {
          data: trendData,
          direction: trendDirection,
          confidence: 0.8 + Math.random() * 0.15
        },
        usage: {
          current: Math.round(Math.random() * 1000),
          unit: service.category === 'compute' ? 'instance-hours' : 
                service.category === 'storage' ? 'GB' :
                service.category === 'database' ? 'DB-hours' : 'requests',
          efficiency: 70 + Math.random() * 25
        },
        accounts: filters.accounts.length > 0 ? filters.accounts : ['production', 'staging'],
        regions: filters.regions.length > 0 ? filters.regions : ['us-east-1', 'us-west-2'],
        metadata: {
          instanceCount: service.category === 'compute' ? Math.floor(Math.random() * 50) + 5 : undefined,
          avgInstanceCost: service.category === 'compute' ? Math.round(current / 10) : undefined,
          utilizationRate: service.category === 'compute' ? 60 + Math.random() * 35 : undefined,
          lastOptimized: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          tags: {
            environment: Math.random() > 0.5 ? 'production' : 'staging',
            team: ['engineering', 'data', 'platform'][Math.floor(Math.random() * 3)]
          }
        }
      }
    })

    // Calculate summary
    const totalCost = services.reduce((sum, service) => sum + service.cost.current, 0)
    const categoryTotals = services.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + service.cost.current
      return acc
    }, {} as Record<string, number>)

    const topCostCategories = Object.entries(categoryTotals)
      .map(([category, cost]) => ({
        category,
        cost,
        percentage: (cost / totalCost) * 100
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 3)

    return {
      services: services.sort((a, b) => b.cost.current - a.cost.current),
      summary: {
        totalCost: Math.round(totalCost),
        totalServices: services.length,
        avgCostPerService: Math.round(totalCost / services.length),
        topCostCategories
      },
      filters: {
        appliedFilters: filters.services,
        availableCategories: [...new Set(serviceTypes.map(s => s.category))],
        costRange: {
          min: Math.min(...services.map(s => s.cost.current)),
          max: Math.max(...services.map(s => s.cost.current))
        }
      },
      metadata: {
        dateRange: {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        },
        lastUpdated: new Date().toISOString(),
        currency: 'USD'
      }
    }
  }
}

interface ServiceCostsTableProps {
  maxRows?: number
  showSearch?: boolean
  showTrends?: boolean
  compact?: boolean
  title?: string
}

export default function ServiceCostsTable({ 
  maxRows = 10, 
  showSearch = true, 
  showTrends = true,
  compact = false,
  title = "Spend by Service"
}: ServiceCostsTableProps) {
  const { user } = useAuth()
  const { filters, isLoading: filtersLoading } = useDashboardFilters()
  const [tableData, setTableData] = useState<ServiceCostsTableData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch service costs data based on filters
  useEffect(() => {
    const fetchServiceData = async () => {
      if (!user || filtersLoading) return

      setIsLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400))
        
        // Generate demo data (replace with real API call)
        // TODO: Replace with actual API call when ready
        // const queryParams = filterUtils.toQueryParams(filters)
        // const response = await fetch(`${SERVICE_COSTS_API_CONFIG.endpoint}?${new URLSearchParams(queryParams)}`)
        // const data = await response.json()
        
        const data = SERVICE_COSTS_API_CONFIG.generateDemoData(filters, user)
        setTableData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service costs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchServiceData()
  }, [filters, user, filtersLoading])

  // Filter services by search term
  const filteredServices = tableData?.services.filter(service =>
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, maxRows) || []

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      compute: 'bg-blue-100 text-blue-800',
      storage: 'bg-green-100 text-green-800',
      database: 'bg-purple-100 text-purple-800',
      networking: 'bg-orange-100 text-orange-800',
      analytics: 'bg-yellow-100 text-yellow-800',
      security: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp className="h-3 w-3 text-red-500" />
    if (direction === 'down') return <TrendingDown className="h-3 w-3 text-green-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  if (!tableData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading service costs...</span>
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
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {!compact && (
              <p className="text-sm text-muted-foreground mt-1">
                Total: ${tableData.summary.totalCost.toLocaleString()} across {tableData.summary.totalServices} services
              </p>
            )}
          </div>
          {showSearch && (
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              {!compact && <TableHead>Category</TableHead>}
              <TableHead>Cost</TableHead>
              <TableHead>Change</TableHead>
              {showTrends && <TableHead className="text-right">7-Day Trend</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.serviceId}>
                <TableCell>
                  <div>
                    <p className="font-medium">{service.serviceName}</p>
                    {!compact && (
                      <p className="text-xs text-muted-foreground">{service.displayName}</p>
                    )}
                  </div>
                </TableCell>
                {!compact && (
                  <TableCell>
                    <Badge variant="outline" className={getCategoryBadgeColor(service.category)}>
                      {service.category}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <div>
                    <p className="font-medium">${service.cost.current.toLocaleString()}</p>
                    {!compact && (
                      <p className="text-xs text-muted-foreground">
                        {service.usage.current.toLocaleString()} {service.usage.unit}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                                            {getTrendIcon(service.trend.direction)}
                    <span className={`text-sm ${
                      service.cost.changePercent > 0 ? 'text-red-600' : 
                      service.cost.changePercent < 0 ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {service.cost.changePercent > 0 ? '+' : ''}{service.cost.changePercent}%
                    </span>
                  </div>
                </TableCell>
                {showTrends && (
                  <TableCell>
                    <ChartContainer config={{}} className="h-[40px] w-[150px] ml-auto">
                      <ResponsiveContainer>
                        <LineChart data={service.trend.data.map((v) => ({ value: v }))}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={service.trend.direction === 'up' ? 'hsl(var(--destructive))' : 
                                   service.trend.direction === 'down' ? 'hsl(var(--chart-2))' : 
                                   'hsl(var(--chart-1))'}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {searchTerm && filteredServices.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No services found matching &quot;{searchTerm}&quot;</p>
          </div>
        )}
        
        {filteredServices.length === maxRows && tableData.services.length > maxRows && (
          <div className="text-center py-2 border-t">
            <p className="text-xs text-muted-foreground">
              Showing {maxRows} of {tableData.services.length} services
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export the API configuration for documentation
export { SERVICE_COSTS_API_CONFIG }