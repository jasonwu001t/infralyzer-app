/**
 * Used by: cost-analytics
 * Purpose: Interactive calculator showing cost impact of different discount combinations
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { Calculator, TrendingDown, TrendingUp, DollarSign } from "lucide-react"

interface SavingsScenario {
  scenarioName: string
  description: string
  contractDiscount: number
  commitmentDiscount: number
  volumeDiscount: number
  totalDiscount: number
  monthlyCost: number
  monthlySavings: number
  annualSavings: number
  paybackPeriod?: number
  requirements: string[]
  riskLevel: 'Low' | 'Medium' | 'High'
}

const generateSavingsScenarios = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<{
  scenarios: SavingsScenario[],
  baselineCost: number,
  currentScenario: string
}> => {
  const baselineCost = organization === 'StartupCo' ? 45000 : 125000
  const roleMultiplier = role === 'admin' ? 1.1 : role === 'analyst' ? 1.0 : 0.9
  const adjustedBaseline = Math.round(baselineCost * roleMultiplier)

  const scenarios: SavingsScenario[] = [
    {
      scenarioName: "Baseline (No Discounts)",
      description: "Standard list pricing with no commitments or contracts",
      contractDiscount: 0,
      commitmentDiscount: 0,
      volumeDiscount: 0,
      totalDiscount: 0,
      monthlyCost: adjustedBaseline,
      monthlySavings: 0,
      annualSavings: 0,
      requirements: ["No commitments required", "Pay-as-you-go pricing"],
      riskLevel: 'Low'
    },
    {
      scenarioName: "Contract Only",
      description: "Enterprise contract with negotiated rates",
      contractDiscount: role === 'admin' ? 0.12 : 0.08,
      commitmentDiscount: 0,
      volumeDiscount: 0,
      totalDiscount: role === 'admin' ? 0.12 : 0.08,
      monthlyCost: Math.round(adjustedBaseline * (1 - (role === 'admin' ? 0.12 : 0.08))),
      monthlySavings: Math.round(adjustedBaseline * (role === 'admin' ? 0.12 : 0.08)),
      annualSavings: Math.round(adjustedBaseline * (role === 'admin' ? 0.12 : 0.08) * 12),
      requirements: ["Enterprise agreement", "Minimum commitment period", "Volume thresholds"],
      riskLevel: 'Low'
    },
    {
      scenarioName: "Commitment Only (1-Year RI)",
      description: "1-year Reserved Instances with no upfront payment",
      contractDiscount: 0,
      commitmentDiscount: 0.15,
      volumeDiscount: 0,
      totalDiscount: 0.15,
      monthlyCost: Math.round(adjustedBaseline * 0.85),
      monthlySavings: Math.round(adjustedBaseline * 0.15),
      annualSavings: Math.round(adjustedBaseline * 0.15 * 12),
      requirements: ["1-year commitment", "Capacity planning", "Instance type commitment"],
      riskLevel: 'Medium'
    },
    {
      scenarioName: "Contract + Commitment",
      description: "Enterprise contract with 1-year Reserved Instances",
      contractDiscount: role === 'admin' ? 0.12 : 0.08,
      commitmentDiscount: 0.15,
      volumeDiscount: 0,
      totalDiscount: 1 - (1 - (role === 'admin' ? 0.12 : 0.08)) * (1 - 0.15),
      monthlyCost: Math.round(adjustedBaseline * (1 - (role === 'admin' ? 0.12 : 0.08)) * 0.85),
      monthlySavings: Math.round(adjustedBaseline * (1 - (1 - (role === 'admin' ? 0.12 : 0.08)) * 0.85)),
      annualSavings: Math.round(adjustedBaseline * (1 - (1 - (role === 'admin' ? 0.12 : 0.08)) * 0.85) * 12),
      requirements: ["Enterprise agreement", "1-year RI commitment", "Capacity planning"],
      riskLevel: 'Medium'
    },
    {
      scenarioName: "Savings Plans",
      description: "Compute Savings Plans with flexible usage",
      contractDiscount: 0,
      commitmentDiscount: 0.17,
      volumeDiscount: 0,
      totalDiscount: 0.17,
      monthlyCost: Math.round(adjustedBaseline * 0.83),
      monthlySavings: Math.round(adjustedBaseline * 0.17),
      annualSavings: Math.round(adjustedBaseline * 0.17 * 12),
      requirements: ["1-year compute commitment", "Flexible instance families", "Regional flexibility"],
      riskLevel: 'Medium'
    },
    {
      scenarioName: "Full Optimization",
      description: "Contract + 3-year RI + Volume discounts",
      contractDiscount: role === 'admin' ? 0.15 : 0.12,
      commitmentDiscount: 0.25,
      volumeDiscount: 0.05,
      totalDiscount: 1 - (1 - (role === 'admin' ? 0.15 : 0.12)) * (1 - 0.25) * (1 - 0.05),
      monthlyCost: Math.round(adjustedBaseline * (1 - (role === 'admin' ? 0.15 : 0.12)) * 0.75 * 0.95),
      monthlySavings: Math.round(adjustedBaseline * (1 - (1 - (role === 'admin' ? 0.15 : 0.12)) * 0.75 * 0.95)),
      annualSavings: Math.round(adjustedBaseline * (1 - (1 - (role === 'admin' ? 0.15 : 0.12)) * 0.75 * 0.95) * 12),
      paybackPeriod: 8, // months
      requirements: ["3-year commitment", "Large volume thresholds", "Advanced capacity planning"],
      riskLevel: 'High'
    }
  ]

  // Calculate remaining fields
  scenarios.forEach(scenario => {
    if (scenario.monthlySavings === 0) {
      scenario.monthlySavings = adjustedBaseline - scenario.monthlyCost
      scenario.annualSavings = scenario.monthlySavings * 12
    }
  })

  return {
    scenarios,
    baselineCost: adjustedBaseline,
    currentScenario: role === 'admin' ? "Contract + Commitment" : "Contract Only"
  }
}

// Component API configuration
const SAVINGS_CALCULATOR_API_CONFIG = {
  relevantFilters: ['dateRange'] as (keyof DashboardFilters)[],
  endpoint: '/api/cost-analytics/savings-scenarios',
  cacheDuration: 20 * 60 * 1000, // 20 minutes
}

export default function SavingsScenarioCalculator() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: savingsData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateSavingsScenarios(filters, user.id, user.role, user.organization)
    },
    SAVINGS_CALCULATOR_API_CONFIG.relevantFilters,
    [user?.id]
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Savings Scenario Calculator</CardTitle>
        <CardDescription>Loading savings scenarios...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error || !savingsData) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Savings Scenario Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error || "Failed to load savings data"}</p>
        </div>
      </CardContent>
    </Card>
  )

  const getRiskColor = (risk: string) => {
    return risk === 'Low' ? 'bg-green-100 text-green-800' :
           risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
           'bg-red-100 text-red-800'
  }

  const maxSavings = Math.max(...savingsData.scenarios.map(s => s.annualSavings))

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Savings Scenario Calculator
        </CardTitle>
        <CardDescription>
          Compare different discount combinations and their impact on your cloud costs
        </CardDescription>
        <div className="flex gap-4 text-sm">
          <div className="text-blue-600 font-medium">
            Baseline: ${savingsData.baselineCost.toLocaleString()}/month
          </div>
          <div className="text-green-600 font-medium">
            Current: {savingsData.currentScenario}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {savingsData.scenarios.map((scenario, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                scenario.scenarioName === savingsData.currentScenario 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    {scenario.scenarioName}
                    {scenario.scenarioName === savingsData.currentScenario && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Current
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
                <Badge className={getRiskColor(scenario.riskLevel)}>
                  {scenario.riskLevel} Risk
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Cost:</span>
                    <span className="font-semibold">${scenario.monthlyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Monthly Savings:</span>
                    <span className="font-semibold text-green-600">
                      ${scenario.monthlySavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Annual Savings:</span>
                    <span className="font-semibold text-green-600">
                      ${scenario.annualSavings.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Contract Discount:</span>
                    <span>{(scenario.contractDiscount * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commitment Discount:</span>
                    <span>{(scenario.commitmentDiscount * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Discount:</span>
                    <span className="font-semibold">{(scenario.totalDiscount * 100).toFixed(1)}%</span>
                  </div>
                  {scenario.paybackPeriod && (
                    <div className="flex justify-between text-sm">
                      <span>Payback Period:</span>
                      <span>{scenario.paybackPeriod} months</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Requirements:</div>
                  <ul className="text-xs space-y-1">
                    {scenario.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Savings Potential</span>
                  <span>{((scenario.annualSavings / maxSavings) * 100).toFixed(0)}%</span>
                </div>
                <Progress 
                  value={(scenario.annualSavings / maxSavings) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}