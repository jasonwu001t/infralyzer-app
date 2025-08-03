/**
 * Used by: dashboard, cost-analytics, capacity, allocation
 * Purpose: Table showing account costs with trend charts, usage metrics, and role-based data filtering
 */
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { TrendingUp, TrendingDown, Database } from "lucide-react"

interface AccountCostData {
  name: string
  accountId: string
  environment: string
  cost: number
  usage: {
    compute: number
    storage: number
    network: number
    requests: number
  }
  costPerUsage: {
    costPerComputeHour: number
    costPerGBStorage: number
    costPerGBTransfer: number
    costPerMillionRequests: number
  }
  efficiency: {
    utilizationRate: number
    costTrend: 'up' | 'down' | 'stable'
    optimizationPotential: number
  }
  trend: number[]
}

const generateAccountCostsData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<AccountCostData[]> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.3 : 1
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.8 : 0.6
  const multiplier = baseMultiplier * roleMultiplier

  const allAccounts = [
    { 
      name: "Prod-West-1", 
      accountId: "1111", 
      environment: "Production",
      baseCost: 510234, 
      baseTrend: [45, 47, 48, 47, 50, 52, 51],
      baseUsage: { compute: 2500, storage: 15000, network: 8500, requests: 125000000 }
    },
    { 
      name: "Data-Lake-Main", 
      accountId: "2222", 
      environment: "Production",
      baseCost: 320456, 
      baseTrend: [28, 30, 32, 31, 32, 33, 32],
      baseUsage: { compute: 1800, storage: 25000, network: 5200, requests: 80000000 }
    },
    { 
      name: "Shared-Services", 
      accountId: "3333", 
      environment: "Shared",
      baseCost: 180987, 
      baseTrend: [16, 17, 18, 18, 19, 18, 18],
      baseUsage: { compute: 900, storage: 8000, network: 3200, requests: 45000000 }
    },
    { 
      name: "Dev-Sandbox", 
      accountId: "4444", 
      environment: "Development",
      baseCost: 75123, 
      baseTrend: [6, 7, 8, 7, 8, 7, 8],
      baseUsage: { compute: 450, storage: 3500, network: 1200, requests: 25000000 }
    },
    { 
      name: "Marketing-Site", 
      accountId: "5555", 
      environment: "Production",
      baseCost: 45670, 
      baseTrend: [4, 4, 5, 4, 5, 5, 5],
      baseUsage: { compute: 200, storage: 2000, network: 8000, requests: 150000000 }
    },
    { 
      name: "ML-Training", 
      accountId: "6666", 
      environment: "Compute",
      baseCost: 125000, 
      baseTrend: [10, 12, 14, 13, 15, 16, 13],
      baseUsage: { compute: 3200, storage: 5000, network: 2000, requests: 15000000 }
    },
    { 
      name: "Security-Hub", 
      accountId: "7777", 
      environment: "Security",
      baseCost: 65000, 
      baseTrend: [5, 6, 6, 7, 6, 7, 7],
      baseUsage: { compute: 300, storage: 4000, network: 1500, requests: 35000000 }
    },
  ]

  let filteredAccounts = allAccounts
  if (filters.accounts && filters.accounts.length > 0) {
    filteredAccounts = allAccounts.filter(acc => filters.accounts.some(filterAcc => acc.name.toLowerCase().includes(filterAcc.toLowerCase())))
  }

  // Filter by cost threshold if set (placeholder for future filter enhancement)
  // if (filters.costThreshold?.min || filters.costThreshold?.max) {
  //   filteredAccounts = filteredAccounts.filter(acc => {
  //     const cost = acc.baseCost * multiplier
  //     return (!filters.costThreshold?.min || cost >= filters.costThreshold.min) &&
  //            (!filters.costThreshold?.max || cost <= filters.costThreshold.max)
  //   })
  // }

  return filteredAccounts.map(account => {
    const cost = Math.floor(account.baseCost * multiplier)
    const usage = {
      compute: Math.floor(account.baseUsage.compute * multiplier),
      storage: Math.floor(account.baseUsage.storage * multiplier),
      network: Math.floor(account.baseUsage.network * multiplier),
      requests: Math.floor(account.baseUsage.requests * multiplier)
    }

    return {
      name: account.name,
      accountId: account.accountId,
      environment: account.environment,
      cost,
      usage,
      costPerUsage: {
        costPerComputeHour: usage.compute > 0 ? +(cost * 0.65 / usage.compute).toFixed(3) : 0,
        costPerGBStorage: usage.storage > 0 ? +(cost * 0.15 / usage.storage).toFixed(4) : 0,
        costPerGBTransfer: usage.network > 0 ? +(cost * 0.12 / usage.network).toFixed(4) : 0,
        costPerMillionRequests: usage.requests > 0 ? +(cost * 0.08 / (usage.requests / 1000000)).toFixed(2) : 0
      },
      efficiency: {
        utilizationRate: Math.floor(Math.random() * 30 + 70), // 70-100%
        costTrend: (account.baseTrend[6] > account.baseTrend[0] ? 'up' : 
                   account.baseTrend[6] < account.baseTrend[0] ? 'down' : 'stable') as 'up' | 'down' | 'stable',
        optimizationPotential: Math.floor(Math.random() * 20 + 5) // 5-25%
      },
      trend: account.baseTrend.map(t => Math.floor(t * multiplier))
    }
  }).slice(0, role === 'viewer' ? 3 : 6) // Limit results based on role
}

// Component API configuration
const ACCOUNT_COSTS_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/account-costs',
  cacheDuration: 5 * 60 * 1000, // 5 minutes
}

export default function AccountCostsTable() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: accountData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateAccountCostsData(filters, user.id, user.role, user.organization)
    },
    ACCOUNT_COSTS_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
        <CardDescription>Loading account cost data...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
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
        <CardTitle>Spend by Account</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-sm">Error: {error}</p>
        <button 
          className="text-blue-500 hover:underline text-sm mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </CardContent>
    </Card>
  )

  if (!accountData || accountData.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
        <CardDescription>No account data available</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          No accounts found matching your current filters.
        </p>
      </CardContent>
    </Card>
  )

  const getEnvironmentColor = (env: string) => {
    const colors = {
      'Production': 'bg-red-100 text-red-800',
      'Development': 'bg-blue-100 text-blue-800',
      'Staging': 'bg-yellow-100 text-yellow-800',
      'Shared': 'bg-purple-100 text-purple-800',
      'Security': 'bg-green-100 text-green-800',
      'Compute': 'bg-orange-100 text-orange-800'
    }
    return colors[env as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-red-500" />
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-green-500" />
    return <Database className="h-3 w-3 text-gray-500" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
        <CardDescription>Account costs, usage metrics, and efficiency analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Cost Overview</TabsTrigger>
            <TabsTrigger value="usage">Cost per Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">7-Day Chart</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountData.map((account) => (
                  <TableRow key={account.accountId}>
                    <TableCell className="font-medium">
                      {account.name}
                      <div className="text-xs text-muted-foreground">
                        ID: {account.accountId}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEnvironmentColor(account.environment)}>
                        {account.environment}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${account.cost.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {account.efficiency.utilizationRate}% utilized
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {account.efficiency.optimizationPotential}% potential savings
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(account.efficiency.costTrend)}
                        <span className="text-sm capitalize">
                          {account.efficiency.costTrend}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChartContainer config={{}} className="h-[40px] w-[100px] ml-auto">
                        <ResponsiveContainer>
                          <LineChart data={account.trend.map((v, i) => ({ day: i + 1, value: v }))}>
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
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Compute<br/><span className="text-xs text-muted-foreground">($/hour)</span></TableHead>
                  <TableHead>Storage<br/><span className="text-xs text-muted-foreground">($/GB)</span></TableHead>
                  <TableHead>Transfer<br/><span className="text-xs text-muted-foreground">($/GB)</span></TableHead>
                  <TableHead>Requests<br/><span className="text-xs text-muted-foreground">($/M requests)</span></TableHead>
                  <TableHead>Usage Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountData.map((account) => (
                  <TableRow key={account.accountId}>
                    <TableCell className="font-medium">
                      {account.name}
                      <div className="text-xs text-muted-foreground">
                        ${account.cost.toLocaleString()} total
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        ${account.costPerUsage.costPerComputeHour}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account.usage.compute.toLocaleString()}h
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        ${account.costPerUsage.costPerGBStorage}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account.usage.storage.toLocaleString()}GB
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        ${account.costPerUsage.costPerGBTransfer}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {account.usage.network.toLocaleString()}GB
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        ${account.costPerUsage.costPerMillionRequests}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(account.usage.requests / 1000000).toFixed(1)}M
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        <div>Compute: {((account.cost * 0.65) / account.cost * 100).toFixed(0)}%</div>
                        <div>Storage: {((account.cost * 0.15) / account.cost * 100).toFixed(0)}%</div>
                        <div>Network: {((account.cost * 0.12) / account.cost * 100).toFixed(0)}%</div>
                        <div>Other: {((account.cost * 0.08) / account.cost * 100).toFixed(0)}%</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Export API configuration for documentation
export { ACCOUNT_COSTS_API_CONFIG }
