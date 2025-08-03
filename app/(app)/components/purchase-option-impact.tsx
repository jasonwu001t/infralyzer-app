/**
 * Used by: cost-analytics
 * Purpose: Detailed analysis of purchase option impact on costs (On-Demand, Reserved, Spot, Savings Plans)
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { ShoppingCart, Zap, Clock, Shield } from "lucide-react"

interface PurchaseOptionData {
  optionType: string
  currentUsage: number
  currentCost: number
  optimalUsage: number
  optimalCost: number
  potentialSavings: number
  commitmentPeriod: string
  flexibility: string
  discountRange: string
  icon: string
  description: string
  riskLevel: 'Low' | 'Medium' | 'High'
  requirements: string[]
}

interface UsageBreakdown {
  service: string
  onDemand: number
  reserved: number
  spot: number
  savingsPlans: number
  totalCost: number
  optimizedCost: number
  savingsOpportunity: number
}

const generatePurchaseOptionData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<{
  purchaseOptions: PurchaseOptionData[],
  usageBreakdown: UsageBreakdown[],
  totalMonthlyCost: number,
  totalOptimizedCost: number
}> => {
  const baseMultiplier = organization === 'StartupCo' ? 0.7 : 1.0
  const roleMultiplier = role === 'admin' ? 1.1 : role === 'analyst' ? 1.0 : 0.9

  const purchaseOptions: PurchaseOptionData[] = [
    {
      optionType: "On-Demand",
      currentUsage: 60,
      currentCost: 45000 * baseMultiplier * roleMultiplier,
      optimalUsage: 30,
      optimalCost: 22500 * baseMultiplier * roleMultiplier,
      potentialSavings: 22500 * baseMultiplier * roleMultiplier,
      commitmentPeriod: "None",
      flexibility: "Maximum",
      discountRange: "0%",
      icon: "ShoppingCart",
      description: "Pay-as-you-go with no commitments",
      riskLevel: 'Low',
      requirements: ["No planning required", "Immediate availability", "Full flexibility"]
    },
    {
      optionType: "Reserved Instances",
      currentUsage: 25,
      currentCost: 15000 * baseMultiplier * roleMultiplier,
      optimalUsage: 40,
      optimalCost: 20000 * baseMultiplier * roleMultiplier,
      potentialSavings: 12000 * baseMultiplier * roleMultiplier,
      commitmentPeriod: "1-3 Years",
      flexibility: "Medium",
      discountRange: "20-40%",
      icon: "Clock",
      description: "Capacity reservations with significant discounts",
      riskLevel: 'Medium',
      requirements: ["Capacity planning", "Instance type commitment", "Regional commitment"]
    },
    {
      optionType: "Spot Instances",
      currentUsage: 10,
      currentCost: 3000 * baseMultiplier * roleMultiplier,
      optimalUsage: 20,
      optimalCost: 5000 * baseMultiplier * roleMultiplier,
      potentialSavings: 15000 * baseMultiplier * roleMultiplier,
      commitmentPeriod: "None",
      flexibility: "High",
      discountRange: "50-90%",
      icon: "Zap",
      description: "Spare capacity with deep discounts",
      riskLevel: 'High',
      requirements: ["Fault-tolerant workloads", "Flexible timing", "Auto-scaling architecture"]
    },
    {
      optionType: "Savings Plans",
      currentUsage: 5,
      currentCost: 2500 * baseMultiplier * roleMultiplier,
      optimalUsage: 10,
      optimalCost: 4000 * baseMultiplier * roleMultiplier,
      potentialSavings: 1500 * baseMultiplier * roleMultiplier,
      commitmentPeriod: "1-3 Years",
      flexibility: "High",
      discountRange: "17-25%",
      icon: "Shield",
      description: "Flexible compute commitment with family portability",
      riskLevel: 'Medium',
      requirements: ["Compute hour commitment", "Family flexibility", "Regional flexibility"]
    }
  ]

  const usageBreakdown: UsageBreakdown[] = [
    {
      service: "EC2 Compute",
      onDemand: 25000 * baseMultiplier * roleMultiplier,
      reserved: 12000 * baseMultiplier * roleMultiplier,
      spot: 2000 * baseMultiplier * roleMultiplier,
      savingsPlans: 1500 * baseMultiplier * roleMultiplier,
      totalCost: 40500 * baseMultiplier * roleMultiplier,
      optimizedCost: 28000 * baseMultiplier * roleMultiplier,
      savingsOpportunity: 12500 * baseMultiplier * roleMultiplier
    },
    {
      service: "RDS Database",
      onDemand: 8000 * baseMultiplier * roleMultiplier,
      reserved: 2500 * baseMultiplier * roleMultiplier,
      spot: 0,
      savingsPlans: 500 * baseMultiplier * roleMultiplier,
      totalCost: 11000 * baseMultiplier * roleMultiplier,
      optimizedCost: 7500 * baseMultiplier * roleMultiplier,
      savingsOpportunity: 3500 * baseMultiplier * roleMultiplier
    },
    {
      service: "Lambda Compute",
      onDemand: 3000 * baseMultiplier * roleMultiplier,
      reserved: 0,
      spot: 0,
      savingsPlans: 500 * baseMultiplier * roleMultiplier,
      totalCost: 3500 * baseMultiplier * roleMultiplier,
      optimizedCost: 2800 * baseMultiplier * roleMultiplier,
      savingsOpportunity: 700 * baseMultiplier * roleMultiplier
    },
    {
      service: "ElastiCache",
      onDemand: 5000 * baseMultiplier * roleMultiplier,
      reserved: 1000 * baseMultiplier * roleMultiplier,
      spot: 0,
      savingsPlans: 0,
      totalCost: 6000 * baseMultiplier * roleMultiplier,
      optimizedCost: 4200 * baseMultiplier * roleMultiplier,
      savingsOpportunity: 1800 * baseMultiplier * roleMultiplier
    }
  ]

  const totalMonthlyCost = usageBreakdown.reduce((sum, item) => sum + item.totalCost, 0)
  const totalOptimizedCost = usageBreakdown.reduce((sum, item) => sum + item.optimizedCost, 0)

  return {
    purchaseOptions,
    usageBreakdown,
    totalMonthlyCost,
    totalOptimizedCost
  }
}

// Component API configuration
const PURCHASE_OPTION_API_CONFIG = {
  relevantFilters: ['dateRange', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/cost-analytics/purchase-options',
  cacheDuration: 15 * 60 * 1000, // 15 minutes
}

export default function PurchaseOptionImpact() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: purchaseData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generatePurchaseOptionData(filters, user.id, user.role, user.organization)
    },
    PURCHASE_OPTION_API_CONFIG.relevantFilters,
    [user?.id]
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Purchase Option Impact</CardTitle>
        <CardDescription>Loading purchase option analysis...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error || !purchaseData) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Purchase Option Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error || "Failed to load purchase option data"}</p>
        </div>
      </CardContent>
    </Card>
  )

  const getIcon = (iconName: string) => {
    const icons = {
      ShoppingCart: ShoppingCart,
      Clock: Clock,
      Zap: Zap,
      Shield: Shield
    }
    const IconComponent = icons[iconName as keyof typeof icons] || ShoppingCart
    return <IconComponent className="h-5 w-5" />
  }

  const getRiskColor = (risk: string) => {
    return risk === 'Low' ? 'bg-green-100 text-green-800' :
           risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
           'bg-red-100 text-red-800'
  }

  const pieData = purchaseData.purchaseOptions.map(option => ({
    name: option.optionType,
    value: option.currentUsage,
    cost: option.currentCost
  }))

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

  const totalPotentialSavings = purchaseData.totalMonthlyCost - purchaseData.totalOptimizedCost

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Purchase Option Impact Analysis
        </CardTitle>
        <CardDescription>
          Analyze the cost impact of different purchasing strategies and optimization opportunities
        </CardDescription>
        <div className="flex gap-6 text-sm">
          <div className="text-blue-600 font-medium">
            Current Monthly Cost: ${purchaseData.totalMonthlyCost.toLocaleString()}
          </div>
          <div className="text-green-600 font-medium">
            Optimized Cost: ${purchaseData.totalOptimizedCost.toLocaleString()}
          </div>
          <div className="text-purple-600 font-medium">
            Potential Savings: ${totalPotentialSavings.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Usage Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4">Current Usage Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Service Breakdown Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={purchaseData.usageBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="totalCost" fill="#ef4444" name="Current Cost" />
                <Bar dataKey="optimizedCost" fill="#22c55e" name="Optimized Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Purchase Options Analysis */}
        <div>
          <h4 className="font-semibold mb-4">Purchase Options Analysis</h4>
          <div className="grid gap-4">
            {purchaseData.purchaseOptions.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getIcon(option.icon)}
                    <div>
                      <h5 className="font-semibold">{option.optionType}</h5>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <Badge className={getRiskColor(option.riskLevel)}>
                    {option.riskLevel} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Usage</div>
                    <div className="font-semibold">{option.currentUsage}%</div>
                    <div className="text-sm text-green-600">
                      Optimal: {option.optimalUsage}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Discount Range</div>
                    <div className="font-semibold">{option.discountRange}</div>
                    <div className="text-sm text-muted-foreground">
                      vs On-Demand
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Commitment</div>
                    <div className="font-semibold">{option.commitmentPeriod}</div>
                    <div className="text-sm text-muted-foreground">
                      Flexibility: {option.flexibility}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Potential Savings</div>
                    <div className="font-semibold text-green-600">
                      ${option.potentialSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Optimization Progress</span>
                    <span>{Math.round((option.currentUsage / option.optimalUsage) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(option.currentUsage / option.optimalUsage) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="mt-3">
                  <div className="text-sm font-medium mb-2">Requirements:</div>
                  <div className="flex flex-wrap gap-2">
                    {option.requirements.map((req, reqIndex) => (
                      <Badge key={reqIndex} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}