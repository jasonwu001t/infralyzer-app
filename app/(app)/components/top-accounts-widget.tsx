/**
 * Used by: dashboard, cost-analytics
 * Purpose: Top spending accounts widget with role-based data filtering
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface TopAccountData {
  name: string
  accountId: string
  cost: number
}

const generateTopAccountsData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<TopAccountData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allAccounts = [
    { name: "Prod-West-1", accountId: "1111", baseCost: 510234 },
    { name: "Data-Lake-Main", accountId: "2222", baseCost: 320456 },
    { name: "Shared-Services", accountId: "3333", baseCost: 180987 },
    { name: "Dev-Sandbox", accountId: "4444", baseCost: 75123 },
    { name: "ML-Training", accountId: "5555", baseCost: 125000 },
    { name: "Security-Hub", accountId: "6666", baseCost: 95000 },
  ]

  // Filter by accounts if specified
  let filteredAccounts = allAccounts
  if (filters.accounts && filters.accounts.length > 0) {
    filteredAccounts = allAccounts.filter(acc => 
      filters.accounts.some(filterAcc => acc.name.toLowerCase().includes(filterAcc.toLowerCase()))
    )
  }

  // Apply cost threshold filters
  if (filters.costThreshold?.min || filters.costThreshold?.max) {
    filteredAccounts = filteredAccounts.filter(acc => {
      const cost = acc.baseCost * multiplier
      return (!filters.costThreshold?.min || cost >= filters.costThreshold.min) &&
             (!filters.costThreshold?.max || cost <= filters.costThreshold.max)
    })
  }

  return filteredAccounts
    .map(account => ({
      name: `${account.name} (${account.accountId}...)`,
      accountId: account.accountId,
      cost: Math.floor(account.baseCost * multiplier)
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, role === 'viewer' ? 3 : 4)
}

// Component API configuration
const TOP_ACCOUNTS_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts', 'costThreshold'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/top-accounts',
  cacheDuration: 8 * 60 * 1000, // 8 minutes
}

export default function TopAccountsWidget() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: accountData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateTopAccountsData(filters, user.id, user.role, user.organization)
    },
    TOP_ACCOUNTS_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  // Don't fetch data until user is authenticated
  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Accounts by Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Accounts by Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Accounts by Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!accountData || accountData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Top Accounts by Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">No account data available for the selected filters.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {accountData.length} Accounts by Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountData.map((account) => (
              <TableRow key={account.accountId}>
                <TableCell className="font-medium text-sm">{account.name}</TableCell>
                <TableCell className="text-right">${account.cost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { TOP_ACCOUNTS_API_CONFIG }
