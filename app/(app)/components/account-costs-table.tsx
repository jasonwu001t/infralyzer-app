/**
 * Used by: dashboard, cost-analytics, capacity, allocation
 * Purpose: Table showing account costs with trend charts and role-based data filtering
 */
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface AccountCostData {
  name: string
  accountId: string
  cost: number
  trend: number[]
}

const generateAccountCostsData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<AccountCostData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allAccounts = [
    { name: "Prod-West-1", accountId: "1111", baseCost: 510234, baseTrend: [6, 7, 8, 7, 8, 9, 10] },
    { name: "Data-Lake-Main", accountId: "2222", baseCost: 320456, baseTrend: [5, 5, 6, 6, 7, 7, 8] },
    { name: "Shared-Services", accountId: "3333", baseCost: 180987, baseTrend: [4, 4, 4, 5, 5, 6, 6] },
    { name: "Dev-Sandbox", accountId: "4444", baseCost: 75123, baseTrend: [2, 3, 3, 2, 3, 4, 4] },
    { name: "Marketing-Site", accountId: "5555", baseCost: 45670, baseTrend: [1, 1, 2, 2, 2, 3, 3] },
    { name: "ML-Training", accountId: "6666", baseCost: 125000, baseTrend: [3, 4, 5, 4, 5, 6, 7] },
    { name: "Security-Hub", accountId: "7777", baseCost: 65000, baseTrend: [2, 2, 3, 3, 3, 4, 4] },
  ]

  let filteredAccounts = allAccounts
  if (filters.accounts && filters.accounts.length > 0) {
    filteredAccounts = allAccounts.filter(acc => filters.accounts.some(filterAcc => acc.name.toLowerCase().includes(filterAcc.toLowerCase())))
  }

  // Filter by cost threshold if set
  if (filters.costThreshold.min || filters.costThreshold.max) {
    filteredAccounts = filteredAccounts.filter(acc => {
      const cost = acc.baseCost * multiplier
      return (!filters.costThreshold.min || cost >= filters.costThreshold.min) &&
             (!filters.costThreshold.max || cost <= filters.costThreshold.max)
    })
  }

  return filteredAccounts.map(account => ({
    name: `${account.name} (${account.accountId}...)`,
    accountId: account.accountId,
    cost: Math.floor(account.baseCost * multiplier),
    trend: account.baseTrend.map(t => Math.floor(t * multiplier * 0.1))
  })).slice(0, role === 'viewer' ? 3 : 5) // Limit results based on role
}

// Component API configuration
const ACCOUNT_COSTS_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts', 'costThreshold'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/account-costs',
  cacheDuration: 5 * 60 * 1000, // 5 minutes
}

export default function AccountCostsTable() {
  const { user } = useAuth()
  const { data: accountData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateAccountCostsData(filters, user.id, user.role, user.organization)
    },
    ACCOUNT_COSTS_API_CONFIG.relevantFilters
  )

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!accountData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">7-Day Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountData.map((account) => (
              <TableRow key={account.accountId}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>${account.cost.toLocaleString()}</TableCell>
                <TableCell>
                  <ChartContainer config={{}} className="h-[40px] w-[150px] ml-auto">
                    <ResponsiveContainer>
                      <LineChart data={account.trend.map((v) => ({ value: v }))}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
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
export { ACCOUNT_COSTS_API_CONFIG }
