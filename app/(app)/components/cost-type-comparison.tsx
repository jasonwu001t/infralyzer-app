/**
 * Used by: cost-analytics
 * Purpose: Comprehensive comparison of all cost types (List, Billed, Contracted, Effective, Public Equivalent)
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface CostTypeData {
  period: string
  listCost: number
  billedCost: number
  contractedCost: number
  effectiveCost: number
  publicEquivalentBilled: number
  publicEquivalentEffective: number
  contractDiscount: number
  commitmentDiscount: number
  totalSavings: number
}

const generateCostTypeData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<CostTypeData[]> => {
  // Generate realistic cost progression data
  const baseList = organization === 'StartupCo' ? 45000 : 125000
  const data: CostTypeData[] = []

  for (let i = 0; i < 12; i++) {
    const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
    const seasonalMultiplier = 1 + (Math.sin(i / 12 * 2 * Math.PI) * 0.15)
    const growthMultiplier = 1 + (i * 0.03)
    
    const listCost = Math.round(baseList * seasonalMultiplier * growthMultiplier)
    const contractDiscount = role === 'admin' ? 0.12 : 0.08  // 8-12% contract discount
    const commitmentDiscount = 0.15  // 15% commitment discount
    
    const contractedCost = Math.round(listCost * (1 - contractDiscount))
    const billedCost = Math.round(contractedCost * 0.95) // Additional billing optimizations
    const effectiveCost = Math.round(billedCost * (1 - commitmentDiscount))
    
    const publicEquivalentBilled = Math.round(listCost * 1.08) // Public cloud premium
    const publicEquivalentEffective = Math.round(publicEquivalentBilled * 0.90) // Public cloud discounts
    
    const totalSavings = listCost - effectiveCost

    data.push({
      period: month,
      listCost,
      billedCost,
      contractedCost,
      effectiveCost,
      publicEquivalentBilled,
      publicEquivalentEffective,
      contractDiscount: Math.round(listCost * contractDiscount),
      commitmentDiscount: Math.round(billedCost * commitmentDiscount),
      totalSavings
    })
  }

  return data
}

// Component API configuration
const COST_TYPE_API_CONFIG = {
  relevantFilters: ['dateRange', 'accounts', 'services'] as (keyof DashboardFilters)[],
  endpoint: '/api/cost-analytics/cost-types',
  cacheDuration: 10 * 60 * 1000, // 10 minutes
}

export default function CostTypeComparison() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: costData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateCostTypeData(filters, user.id, user.role, user.organization)
    },
    COST_TYPE_API_CONFIG.relevantFilters,
    [user?.id]
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cost Type Comparison</CardTitle>
        <CardDescription>Loading comprehensive cost analysis...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error || !costData) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cost Type Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error || "Failed to load cost data"}</p>
        </div>
      </CardContent>
    </Card>
  )

  const chartConfig = {
    listCost: { label: "List Cost", fill: "#ef4444" },
    contractedCost: { label: "Contracted Cost", fill: "#f97316" },
    billedCost: { label: "Billed Cost", fill: "#eab308" },
    effectiveCost: { label: "Effective Cost", fill: "#22c55e" },
    publicEquivalentBilled: { label: "Public Equivalent Billed", fill: "#a855f7" },
    publicEquivalentEffective: { label: "Public Equivalent Effective", fill: "#3b82f6" },
  }

  // Calculate average savings
  const avgTotalSavings = Math.round(costData.reduce((sum, item) => sum + item.totalSavings, 0) / costData.length)
  const avgSavingsPercent = Math.round((avgTotalSavings / costData[0]?.listCost) * 100)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cost Type Comparison</CardTitle>
        <CardDescription>
          Compare list, contracted, billed, and effective costs across all cost types
        </CardDescription>
        <div className="flex gap-6 text-sm">
          <div className="text-green-600 font-medium">
            Avg Monthly Savings: ${avgTotalSavings.toLocaleString()} ({avgSavingsPercent}%)
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                chartConfig[name as keyof typeof chartConfig]?.label || name
              ]}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend />
            <Bar dataKey="listCost" fill={chartConfig.listCost.fill} name={chartConfig.listCost.label} />
            <Bar dataKey="contractedCost" fill={chartConfig.contractedCost.fill} name={chartConfig.contractedCost.label} />
            <Bar dataKey="billedCost" fill={chartConfig.billedCost.fill} name={chartConfig.billedCost.label} />
            <Bar dataKey="effectiveCost" fill={chartConfig.effectiveCost.fill} name={chartConfig.effectiveCost.label} />
            <Bar dataKey="publicEquivalentBilled" fill={chartConfig.publicEquivalentBilled.fill} name={chartConfig.publicEquivalentBilled.label} />
            <Bar dataKey="publicEquivalentEffective" fill={chartConfig.publicEquivalentEffective.fill} name={chartConfig.publicEquivalentEffective.label} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}