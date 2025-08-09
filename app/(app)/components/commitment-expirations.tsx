/**
 * Used by: dashboard, cost-analytics, optimization, discounts
 * Purpose: Alert widget showing upcoming reserved instance and savings plan expirations
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface CommitmentExpiration {
  id: string
  type: string
  expires: string
  commitment: string
  daysUntilExpiry: number
  urgency: 'critical' | 'warning' | 'normal'
  monthlySavings: string
  utilizationRate: number
  renewalRecommendation: string
  currentSpend: string
}

const generateCommitmentExpirationData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<CommitmentExpiration[]> => {
  const baseCommitments = [
    { 
      id: "SP-123", 
      type: "Savings Plan", 
      baseDays: 15, 
      commitment: "$50/hr",
      monthlySavings: "$2,200",
      utilizationRate: 87,
      renewalRecommendation: "Renew",
      currentSpend: "$36,000"
    },
    { 
      id: "RI-456", 
      type: "EC2 RI", 
      baseDays: 45, 
      commitment: "5x m5.large",
      monthlySavings: "$890",
      utilizationRate: 92,
      renewalRecommendation: "Renew",
      currentSpend: "$8,760"
    },
    { 
      id: "RI-789", 
      type: "RDS RI", 
      baseDays: 88, 
      commitment: "2x db.r5.xlarge",
      monthlySavings: "$340",
      utilizationRate: 76,
      renewalRecommendation: "Review",
      currentSpend: "$4,200"
    },
    { 
      id: "SP-234", 
      type: "Compute SP", 
      baseDays: 120, 
      commitment: "$25/hr",
      monthlySavings: "$1,100",
      utilizationRate: 81,
      renewalRecommendation: "Renew",
      currentSpend: "$18,000"
    },
    { 
      id: "RI-890", 
      type: "DynamoDB RI", 
      baseDays: 180, 
      commitment: "500 WCU",
      monthlySavings: "$180",
      utilizationRate: 94,
      renewalRecommendation: "Renew",
      currentSpend: "$1,200"
    },
  ]

  // StartupCo might have fewer commitments
  const commitmentCount = organization === 'StartupCo' ? 3 : role === 'viewer' ? 3 : 5
  
  return baseCommitments.slice(0, commitmentCount).map(item => {
    const daysUntilExpiry = item.baseDays
    const urgency = daysUntilExpiry <= 30 ? 'critical' : daysUntilExpiry <= 60 ? 'warning' : 'normal'
    const expires = `in ${daysUntilExpiry} days`
    
    return {
      id: item.id,
      type: item.type,
      expires,
      commitment: item.commitment,
      daysUntilExpiry,
      urgency,
      monthlySavings: item.monthlySavings,
      utilizationRate: item.utilizationRate,
      renewalRecommendation: item.renewalRecommendation,
      currentSpend: item.currentSpend
    }
  }).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
}

// Component API configuration
const COMMITMENT_EXPIRATIONS_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/commitment-expirations',
  cacheDuration: 12 * 60 * 60 * 1000, // 12 hours (commitments don't change frequently)
}

export default function CommitmentExpirations() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: expirationData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateCommitmentExpirationData(filters, user.id, user.role, user.organization)
    },
    COMMITMENT_EXPIRATIONS_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )



  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Commitment Expirations</CardTitle>
        <CardDescription>Loading commitment data...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Commitment Expirations</CardTitle>
        <CardDescription>Error loading data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!expirationData || expirationData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Commitment Expirations</CardTitle>
        <CardDescription>No upcoming commitment expirations</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">All commitments are current.</p>
      </CardContent>
    </Card>
  )
  // Calculate summary statistics
  const totalMonthlySavings = expirationData.reduce((sum, item) => 
    sum + parseInt(item.monthlySavings.replace(/[$,]/g, '')), 0
  )
  const averageUtilization = Math.round(
    expirationData.reduce((sum, item) => sum + item.utilizationRate, 0) / expirationData.length
  )
  const criticalCount = expirationData.filter(item => item.urgency === 'critical').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Commitment Management</span>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} Critical
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              ${totalMonthlySavings.toLocaleString()}/mo savings
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Active commitments, utilization rates, and renewal recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Row */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Total Savings</div>
            <div className="text-lg font-bold text-green-600">
              ${totalMonthlySavings.toLocaleString()}/mo
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Avg Utilization</div>
            <div className="text-lg font-bold">{averageUtilization}%</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-muted-foreground">Active Commitments</div>
            <div className="text-lg font-bold">{expirationData.length}</div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Utilization</TableHead>
              <TableHead>Monthly Savings</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expirationData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.type}</div>
                    <div className="text-xs text-muted-foreground">{item.commitment}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${
                    item.urgency === 'critical' ? 'text-red-600' : 
                    item.urgency === 'warning' ? 'text-yellow-600' : 'text-muted-foreground'
                  }`}>
                    {item.expires}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.utilizationRate}%</span>
                      <span className="text-muted-foreground">
                        {item.utilizationRate >= 90 ? 'Excellent' : 
                         item.utilizationRate >= 80 ? 'Good' : 
                         item.utilizationRate >= 70 ? 'Fair' : 'Low'}
                      </span>
                    </div>
                    <Progress 
                      value={item.utilizationRate} 
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-green-600">{item.monthlySavings}</div>
                    <div className="text-xs text-muted-foreground">Current: {item.currentSpend}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      item.renewalRecommendation === 'Renew' ? 'default' : 
                      item.renewalRecommendation === 'Review' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {item.renewalRecommendation}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { COMMITMENT_EXPIRATIONS_API_CONFIG }
