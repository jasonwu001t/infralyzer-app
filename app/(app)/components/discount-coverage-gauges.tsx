/**
 * Used by: dashboard, cost-analytics, optimization, discounts
 * Purpose: Gauge charts showing discount coverage percentages for savings plans and RIs
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"

interface DiscountGap {
  service: string
  instanceType: string
  region: string
  uncoveredSpend: number
  potentialSavings: number
  recommendation: string
  urgency: 'High' | 'Medium' | 'Low'
}

interface DiscountCoverageData {
  riData: { name: string; value: number; fill: string }[]
  spData: { name: string; value: number; fill: string }[]
  riPercentage: number
  spPercentage: number
  riGaps: DiscountGap[]
  spGaps: DiscountGap[]
}

const generateDiscountCoverageData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<DiscountCoverageData> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.8 : 1 // Startups typically have lower RI/SP coverage
  const roleMultiplier = role === 'admin' ? 1 : role === 'analyst' ? 0.95 : 0.9

  const riPercentage = Math.floor(92 * baseMultiplier * roleMultiplier)
  const spPercentage = Math.floor(78 * baseMultiplier * roleMultiplier)

  // Generate RI gaps (Reserved Instance opportunities)
  const riGaps: DiscountGap[] = [
    {
      service: 'EC2',
      instanceType: 'm5.large',
      region: 'us-east-1',
      uncoveredSpend: Math.floor(8500 * baseMultiplier),
      potentialSavings: Math.floor(2550 * baseMultiplier),
      recommendation: 'Standard 1-year RI',
      urgency: 'High'
    },
    {
      service: 'RDS',
      instanceType: 'db.r5.xlarge',
      region: 'us-west-2',
      uncoveredSpend: Math.floor(4200 * baseMultiplier),
      potentialSavings: Math.floor(1260 * baseMultiplier),
      recommendation: 'Convertible 1-year RI',
      urgency: 'Medium'
    },
    {
      service: 'ElastiCache',
      instanceType: 'cache.r6g.large',
      region: 'eu-west-1',
      uncoveredSpend: Math.floor(2100 * baseMultiplier),
      potentialSavings: Math.floor(630 * baseMultiplier),
      recommendation: 'Standard 3-year RI',
      urgency: 'Low'
    }
  ]

  // Generate SP gaps (Savings Plan opportunities)
  const spGaps: DiscountGap[] = [
    {
      service: 'Compute',
      instanceType: 'Mixed Workloads',
      region: 'Multi-region',
      uncoveredSpend: Math.floor(12000 * baseMultiplier),
      potentialSavings: Math.floor(2400 * baseMultiplier),
      recommendation: 'Compute SP 1-year',
      urgency: 'High'
    },
    {
      service: 'Lambda',
      instanceType: 'Function Compute',
      region: 'us-east-1',
      uncoveredSpend: Math.floor(3600 * baseMultiplier),
      potentialSavings: Math.floor(540 * baseMultiplier),
      recommendation: 'Compute SP 1-year',
      urgency: 'Medium'
    },
    {
      service: 'Fargate',
      instanceType: 'Container Compute',
      region: 'us-west-2',
      uncoveredSpend: Math.floor(1800 * baseMultiplier),
      potentialSavings: Math.floor(324 * baseMultiplier),
      recommendation: 'Compute SP 3-year',
      urgency: 'Low'
    }
  ]

  return {
    riData: [{ name: "ri", value: riPercentage, fill: "var(--color-ri)" }],
    spData: [{ name: "sp", value: spPercentage, fill: "var(--color-sp)" }],
    riPercentage,
    spPercentage,
    riGaps: riGaps.slice(0, role === 'viewer' ? 2 : 3),
    spGaps: spGaps.slice(0, role === 'viewer' ? 2 : 3)
  }
}

const chartConfig = {
  value: { label: "Value" },
  ri: { label: "RI Utilization", color: "hsl(var(--chart-1))" },
  sp: { label: "SP Coverage", color: "hsl(var(--chart-2))" },
}

// Component API configuration
const DISCOUNT_COVERAGE_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/dashboard/discount-coverage',
  cacheDuration: 10 * 60 * 1000, // 10 minutes
}

export default function DiscountCoverageGauges() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: coverageData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateDiscountCoverageData(filters, user.id, user.role, user.organization)
    },
    DISCOUNT_COVERAGE_API_CONFIG.relevantFilters,
    [user?.id] // Add user dependency
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500 text-xs">{error}</p>
      </CardContent>
    </Card>
  )

  if (!coverageData) return null

  const { riData, spData, riPercentage, spPercentage, riGaps, spGaps } = coverageData
  const totalPotentialSavings = [...riGaps, ...spGaps].reduce((sum, gap) => sum + gap.potentialSavings, 0)
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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
          <span>Discount Coverage & Gaps</span>
          <Badge variant="outline" className="text-xs">
            ${totalPotentialSavings.toLocaleString()}/mo potential
          </Badge>
        </CardTitle>
        <CardDescription>
          Current coverage rates and optimization opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coverage Gauges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <ResponsiveContainer>
                <RadialBarChart data={riData} startAngle={-270} endAngle={90} innerRadius={60} barSize={20}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm font-medium">RI Utilization: {riPercentage}%</p>
          </div>
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <ResponsiveContainer>
                <RadialBarChart data={spData} startAngle={-270} endAngle={90} innerRadius={60} barSize={20}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm font-medium">SP Coverage: {spPercentage}%</p>
          </div>
        </div>

        {/* Coverage Gaps Table */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Optimization Opportunities:</div>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="h-8">Service</TableHead>
                <TableHead className="h-8">Instance Type</TableHead>
                <TableHead className="h-8">Region</TableHead>
                <TableHead className="h-8">Uncovered Spend</TableHead>
                <TableHead className="h-8">Potential Savings</TableHead>
                <TableHead className="h-8">Recommendation</TableHead>
                <TableHead className="h-8">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* RI Gaps */}
              {riGaps.map((gap, index) => (
                <TableRow key={`ri-${index}`} className="text-xs">
                  <TableCell className="font-medium">{gap.service}</TableCell>
                  <TableCell className="font-mono text-xs">{gap.instanceType}</TableCell>
                  <TableCell>{gap.region}</TableCell>
                  <TableCell>${gap.uncoveredSpend.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${gap.potentialSavings.toLocaleString()}
                  </TableCell>
                  <TableCell>{gap.recommendation}</TableCell>
                  <TableCell>
                    <Badge variant={getUrgencyColor(gap.urgency)} className="text-xs">
                      {gap.urgency}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {/* SP Gaps */}
              {spGaps.map((gap, index) => (
                <TableRow key={`sp-${index}`} className="text-xs">
                  <TableCell className="font-medium">{gap.service}</TableCell>
                  <TableCell className="font-mono text-xs">{gap.instanceType}</TableCell>
                  <TableCell>{gap.region}</TableCell>
                  <TableCell>${gap.uncoveredSpend.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${gap.potentialSavings.toLocaleString()}
                  </TableCell>
                  <TableCell>{gap.recommendation}</TableCell>
                  <TableCell>
                    <Badge variant={getUrgencyColor(gap.urgency)} className="text-xs">
                      {gap.urgency}
                    </Badge>
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

// Export API configuration for documentation
export { DISCOUNT_COVERAGE_API_CONFIG }
