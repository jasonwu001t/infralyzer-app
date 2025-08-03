/**
 * Used by: dashboard, cost-analytics, optimization, discounts
 * Purpose: Alert widget showing upcoming reserved instance and savings plan expirations
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface CommitmentExpiration {
  id: string
  type: string
  expires: string
  commitment: string
  daysUntilExpiry: number
  urgency: 'critical' | 'warning' | 'normal'
}

const generateCommitmentExpirationData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<CommitmentExpiration[]> => {
  const baseCommitments = [
    { id: "SP-123", type: "Savings Plan", baseDays: 15, commitment: "$50/hr" },
    { id: "RI-456", type: "EC2 RI", baseDays: 45, commitment: "5x m5.large" },
    { id: "RI-789", type: "RDS RI", baseDays: 88, commitment: "2x db.r5.xlarge" },
    { id: "SP-234", type: "Compute SP", baseDays: 120, commitment: "$25/hr" },
    { id: "RI-890", type: "DynamoDB RI", baseDays: 180, commitment: "500 WCU" },
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
      urgency
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commitment Expirations</CardTitle>
        <CardDescription>RI/SP expiring in next 90 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Commitment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expirationData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>
                  <span className={`${
                    item.urgency === 'critical' ? 'text-red-600 font-medium' : 
                    item.urgency === 'warning' ? 'text-yellow-600' : 'text-muted-foreground'
                  }`}>
                    {item.expires}
                  </span>
                </TableCell>
                <TableCell>{item.commitment}</TableCell>
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
