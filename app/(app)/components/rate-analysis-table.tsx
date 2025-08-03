/**
 * Used by: cost-analytics
 * Purpose: Comprehensive rate analysis showing how different rates and discounts affect final costs
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { Percent, TrendingDown, TrendingUp } from "lucide-react"

interface RateAnalysisItem {
  serviceName: string
  serviceCategory: string
  listRate: number
  contractedRate: number
  commitmentRate: number
  effectiveRate: number
  publicRate: number
  contractDiscount: number
  commitmentDiscount: number
  totalDiscount: number
  monthlyUsage: number
  monthlyCost: number
  potentialSavings: number
  rateUnit: string
}

const generateRateAnalysisData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<RateAnalysisItem[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.7 : 1.0
  const userMultiplier = role === 'admin' ? 1.1 : role === 'analyst' ? 1.0 : 0.9

  const services = [
    {
      serviceName: "EC2 - m5.xlarge",
      serviceCategory: "Compute",
      listRate: 0.192,
      monthlyUsage: Math.round(720 * baseMultiplier * userMultiplier),
      rateUnit: "per hour"
    },
    {
      serviceName: "RDS - db.r5.large",
      serviceCategory: "Database", 
      listRate: 0.24,
      monthlyUsage: Math.round(720 * baseMultiplier * userMultiplier * 0.8),
      rateUnit: "per hour"
    },
    {
      serviceName: "S3 Standard Storage",
      serviceCategory: "Storage",
      listRate: 0.023,
      monthlyUsage: Math.round(5000 * baseMultiplier * userMultiplier),
      rateUnit: "per GB"
    },
    {
      serviceName: "Lambda Requests",
      serviceCategory: "Compute",
      listRate: 0.0000002,
      monthlyUsage: Math.round(10000000 * baseMultiplier * userMultiplier),
      rateUnit: "per request"
    },
    {
      serviceName: "NAT Gateway",
      serviceCategory: "Networking",
      listRate: 0.045,
      monthlyUsage: Math.round(720 * baseMultiplier * userMultiplier),
      rateUnit: "per hour"
    },
    {
      serviceName: "EBS gp3 Storage",
      serviceCategory: "Storage",
      listRate: 0.08,
      monthlyUsage: Math.round(2000 * baseMultiplier * userMultiplier),
      rateUnit: "per GB"
    },
    {
      serviceName: "CloudFront Data Transfer",
      serviceCategory: "Networking",
      listRate: 0.085,
      monthlyUsage: Math.round(1000 * baseMultiplier * userMultiplier),
      rateUnit: "per GB"
    },
    {
      serviceName: "ElastiCache - cache.r6g.large",
      serviceCategory: "Database",
      listRate: 0.126,
      monthlyUsage: Math.round(720 * baseMultiplier * userMultiplier * 0.6),
      rateUnit: "per hour"
    }
  ]

  return services.map(service => {
    // Contract discount varies by role and service type
    const contractDiscount = service.serviceCategory === 'Compute' ? 
      (role === 'admin' ? 0.15 : 0.12) : 
      (role === 'admin' ? 0.10 : 0.08)
    
    // Commitment discount (Reserved Instances, Savings Plans)
    const commitmentDiscount = service.serviceCategory === 'Compute' ? 0.20 : 0.15
    
    const contractedRate = service.listRate * (1 - contractDiscount)
    const commitmentRate = contractedRate * (1 - commitmentDiscount)
    const effectiveRate = commitmentRate
    
    // Public cloud equivalent (typically higher)
    const publicRate = service.listRate * 1.15
    
    const totalDiscount = 1 - (effectiveRate / service.listRate)
    const monthlyCost = effectiveRate * service.monthlyUsage
    const potentialSavings = (service.listRate - effectiveRate) * service.monthlyUsage

    return {
      serviceName: service.serviceName,
      serviceCategory: service.serviceCategory,
      listRate: service.listRate,
      contractedRate,
      commitmentRate,
      effectiveRate,
      publicRate,
      contractDiscount,
      commitmentDiscount,
      totalDiscount,
      monthlyUsage: service.monthlyUsage,
      monthlyCost,
      potentialSavings,
      rateUnit: service.rateUnit
    }
  })
}

// Component API configuration
const RATE_ANALYSIS_API_CONFIG = {
  relevantFilters: ['dateRange', 'services', 'accounts'] as (keyof DashboardFilters)[],
  endpoint: '/api/cost-analytics/rate-analysis',
  cacheDuration: 15 * 60 * 1000, // 15 minutes
}

export default function RateAnalysisTable() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: rateData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateRateAnalysisData(filters, user.id, user.role, user.organization)
    },
    RATE_ANALYSIS_API_CONFIG.relevantFilters,
    [user?.id]
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Rate Analysis</CardTitle>
        <CardDescription>Loading comprehensive rate comparison...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error || !rateData) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Rate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error || "Failed to load rate data"}</p>
        </div>
      </CardContent>
    </Card>
  )

  const formatRate = (rate: number, unit: string) => {
    if (rate < 0.001) {
      return `$${(rate * 1000000).toFixed(1)}e-6 ${unit}`
    } else if (rate < 1) {
      return `$${rate.toFixed(4)} ${unit}`
    } else {
      return `$${rate.toFixed(2)} ${unit}`
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Compute': 'bg-blue-100 text-blue-800',
      'Database': 'bg-purple-100 text-purple-800',
      'Storage': 'bg-green-100 text-green-800',
      'Networking': 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const totalMonthlyCost = rateData.reduce((sum, item) => sum + item.monthlyCost, 0)
  const totalPotentialSavings = rateData.reduce((sum, item) => sum + item.potentialSavings, 0)
  const avgTotalDiscount = rateData.reduce((sum, item) => sum + item.totalDiscount, 0) / rateData.length

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          Rate Analysis & Discount Impact
        </CardTitle>
        <CardDescription>
          Detailed breakdown of rates, discounts, and cost optimization opportunities
        </CardDescription>
        <div className="flex gap-6 text-sm">
          <div className="text-green-600 font-medium">
            Total Monthly Savings: ${totalPotentialSavings.toLocaleString()}
          </div>
          <div className="text-blue-600 font-medium">
            Average Discount: {(avgTotalDiscount * 100).toFixed(1)}%
          </div>
          <div className="text-purple-600 font-medium">
            Effective Monthly Cost: ${totalMonthlyCost.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>List Rate</TableHead>
                <TableHead>Contract Rate</TableHead>
                <TableHead>Commitment Rate</TableHead>
                <TableHead>Effective Rate</TableHead>
                <TableHead>Public Rate</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Total Discount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rateData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.serviceName}</TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(item.serviceCategory)}>
                      {item.serviceCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-red-600 font-medium">
                    {formatRate(item.listRate, item.rateUnit)}
                  </TableCell>
                  <TableCell className="text-orange-600">
                    {formatRate(item.contractedRate, item.rateUnit)}
                    <div className="text-xs text-muted-foreground">
                      -{(item.contractDiscount * 100).toFixed(0)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-yellow-600">
                    {formatRate(item.commitmentRate, item.rateUnit)}
                    <div className="text-xs text-muted-foreground">
                      -{(item.commitmentDiscount * 100).toFixed(0)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatRate(item.effectiveRate, item.rateUnit)}
                  </TableCell>
                  <TableCell className="text-purple-600">
                    {formatRate(item.publicRate, item.rateUnit)}
                  </TableCell>
                  <TableCell>
                    {item.monthlyUsage.toLocaleString()}
                    <div className="text-xs text-muted-foreground">
                      {item.rateUnit.replace('per ', '')}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${item.monthlyCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      ${item.potentialSavings.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-green-600">
                        {(item.totalDiscount * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}