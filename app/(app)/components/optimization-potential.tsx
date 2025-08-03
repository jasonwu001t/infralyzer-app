/**
 * Used by: dashboard, cost-analytics, capacity, optimization
 * Purpose: Shows optimization recommendations with priority-based savings potential
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface OptimizationData {
  category: string
  potential: number
  opportunities: number
  priority: 'High' | 'Medium' | 'Low'
  services: string[]
}

const generateOptimizationData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<OptimizationData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allOptimizations = [
    { category: "Idle Resources", basePotential: 45200, opportunities: 15, priority: "High" as const, services: ["Amazon EC2", "Amazon RDS"] },
    { category: "Rightsizing", basePotential: 28500, opportunities: 42, priority: "High" as const, services: ["Amazon EC2", "Amazon RDS", "Amazon EKS"] },
    { category: "Savings Plans", basePotential: 12300, opportunities: 5, priority: "Medium" as const, services: ["Amazon EC2", "AWS Lambda"] },
    { category: "Storage Tiering", basePotential: 8700, opportunities: 112, priority: "Medium" as const, services: ["Amazon S3", "Amazon EBS"] },
    { category: "Reserved Instances", basePotential: 18900, opportunities: 8, priority: "High" as const, services: ["Amazon EC2", "Amazon RDS", "Amazon DynamoDB"] },
    { category: "Spot Instances", basePotential: 15600, opportunities: 23, priority: "Medium" as const, services: ["Amazon EC2", "Amazon EKS"] },
  ]

  let filteredOptimizations = allOptimizations

  // Filter by services if specified
  if (filters.services && filters.services.length > 0) {
    filteredOptimizations = filteredOptimizations.filter(opt => 
      opt.services.some(service => filters.services.includes(service))
    )
  }

  return filteredOptimizations.map(opt => ({
    category: opt.category,
    potential: Math.floor(opt.basePotential * multiplier),
    opportunities: Math.floor(opt.opportunities * (role === 'viewer' ? 0.5 : 1)),
    priority: opt.priority,
    services: opt.services
  })).sort((a, b) => b.potential - a.potential).slice(0, role === 'viewer' ? 3 : 6)
}

// Component API configuration
const OPTIMIZATION_POTENTIAL_API_CONFIG = {
  relevantFilters: ['dateRange', 'services', 'accounts'] as (keyof DashboardFilters)[],
  endpoint: '/api/optimization/potential',
  cacheDuration: 10 * 60 * 1000, // 10 minutes (optimization data changes less frequently)
}

export default function OptimizationPotential() {
  const { user } = useAuth()
  const { data: optimizationData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateOptimizationData(filters, user.id, user.role, user.organization)
    },
    OPTIMIZATION_POTENTIAL_API_CONFIG.relevantFilters
  )

  const totalPotential = optimizationData?.reduce((sum, item) => sum + item.potential, 0) || 0

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Potential</CardTitle>
        <CardDescription>Loading potential savings...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/4 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/5 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Potential</CardTitle>
        <CardDescription>Error loading optimization data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!optimizationData || optimizationData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Potential</CardTitle>
        <CardDescription>No optimization opportunities found</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No optimization opportunities detected for the selected filters.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Potential</CardTitle>
        <CardDescription>Total potential savings: ${totalPotential.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Opportunities</TableHead>
              <TableHead className="text-right">Potential Savings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimizationData.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'High' ? 'bg-red-100 text-red-800' :
                    item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority}
                  </span>
                </TableCell>
                <TableCell>{item.opportunities}</TableCell>
                <TableCell className="text-right font-mono">${item.potential.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { OPTIMIZATION_POTENTIAL_API_CONFIG }
