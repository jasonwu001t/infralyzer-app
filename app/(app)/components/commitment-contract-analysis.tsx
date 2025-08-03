/**
 * Used by: cost-analytics
 * Purpose: Detailed analysis comparing commitment discounts vs contract discounts and their combinations
 */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useAuth } from "@/lib/hooks/use-auth"
import { useFilteredData, DashboardFilters } from "@/lib/hooks/use-dashboard-filters"
import { Handshake, Clock, Users, TrendingUp } from "lucide-react"

interface CommitmentContractScenario {
  scenarioName: string
  contractDiscount: number
  commitmentDiscount: number
  combinedDiscount: number
  monthlyCost: number
  annualCost: number
  savings: number
  requirements: string[]
  flexibility: string
  riskLevel: 'Low' | 'Medium' | 'High'
  recommendedFor: string[]
}

interface ServiceComparison {
  serviceName: string
  baselineCost: number
  contractOnly: number
  commitmentOnly: number
  combined: number
  bestOption: string
  maxSavings: number
}

const generateCommitmentContractData = async (filters: DashboardFilters, userId: string, role: string, organization: string): Promise<{
  scenarios: CommitmentContractScenario[],
  serviceComparisons: ServiceComparison[],
  baselineCost: number,
  recommendations: {
    immediate: string,
    shortTerm: string,
    longTerm: string
  }
}> => {
  const baselineCost = organization === 'StartupCo' ? 75000 : 120000
  const roleMultiplier = role === 'admin' ? 1.1 : role === 'analyst' ? 1.0 : 0.9
  const adjustedBaseline = Math.round(baselineCost * roleMultiplier)

  // Contract discount varies by role and organization maturity
  const enterpriseContractDiscount = role === 'admin' ? 0.15 : 0.10
  const standardContractDiscount = role === 'admin' ? 0.12 : 0.08

  const scenarios: CommitmentContractScenario[] = [
    {
      scenarioName: "No Discounts (Baseline)",
      contractDiscount: 0,
      commitmentDiscount: 0,
      combinedDiscount: 0,
      monthlyCost: adjustedBaseline,
      annualCost: adjustedBaseline * 12,
      savings: 0,
      requirements: ["Pay-as-you-go", "No commitments"],
      flexibility: "Maximum",
      riskLevel: 'Low',
      recommendedFor: ["Variable workloads", "Development environments", "Short-term projects"]
    },
    {
      scenarioName: "Contract Only - Standard",
      contractDiscount: standardContractDiscount,
      commitmentDiscount: 0,
      combinedDiscount: standardContractDiscount,
      monthlyCost: Math.round(adjustedBaseline * (1 - standardContractDiscount)),
      annualCost: Math.round(adjustedBaseline * (1 - standardContractDiscount) * 12),
      savings: Math.round(adjustedBaseline * standardContractDiscount * 12),
      requirements: ["Enterprise agreement", "Volume commitments", "Annual contract"],
      flexibility: "High",
      riskLevel: 'Low',
      recommendedFor: ["Growing businesses", "Predictable workloads", "Cost-conscious teams"]
    },
    {
      scenarioName: "Contract Only - Enterprise",
      contractDiscount: enterpriseContractDiscount,
      commitmentDiscount: 0,
      combinedDiscount: enterpriseContractDiscount,
      monthlyCost: Math.round(adjustedBaseline * (1 - enterpriseContractDiscount)),
      annualCost: Math.round(adjustedBaseline * (1 - enterpriseContractDiscount) * 12),
      savings: Math.round(adjustedBaseline * enterpriseContractDiscount * 12),
      requirements: ["Large enterprise agreement", "High volume commitments", "Multi-year contract"],
      flexibility: "High",
      riskLevel: 'Low',
      recommendedFor: ["Large enterprises", "Established workloads", "Strategic partnerships"]
    },
    {
      scenarioName: "Commitment Only - 1 Year RI",
      contractDiscount: 0,
      commitmentDiscount: 0.20,
      combinedDiscount: 0.20,
      monthlyCost: Math.round(adjustedBaseline * 0.80),
      annualCost: Math.round(adjustedBaseline * 0.80 * 12),
      savings: Math.round(adjustedBaseline * 0.20 * 12),
      requirements: ["1-year capacity reservation", "Instance type commitment", "Region commitment"],
      flexibility: "Medium",
      riskLevel: 'Medium',
      recommendedFor: ["Steady-state workloads", "Predictable capacity", "Cost optimization focus"]
    },
    {
      scenarioName: "Commitment Only - 3 Year RI",
      contractDiscount: 0,
      commitmentDiscount: 0.35,
      combinedDiscount: 0.35,
      monthlyCost: Math.round(adjustedBaseline * 0.65),
      annualCost: Math.round(adjustedBaseline * 0.65 * 12),
      savings: Math.round(adjustedBaseline * 0.35 * 12),
      requirements: ["3-year capacity reservation", "Instance type commitment", "Region commitment"],
      flexibility: "Low",
      riskLevel: 'High',
      recommendedFor: ["Stable production workloads", "Long-term planning", "Maximum savings priority"]
    },
    {
      scenarioName: "Contract + 1-Year Commitment",
      contractDiscount: standardContractDiscount,
      commitmentDiscount: 0.20,
      combinedDiscount: 1 - (1 - standardContractDiscount) * (1 - 0.20),
      monthlyCost: Math.round(adjustedBaseline * (1 - standardContractDiscount) * 0.80),
      annualCost: Math.round(adjustedBaseline * (1 - standardContractDiscount) * 0.80 * 12),
      savings: Math.round(adjustedBaseline * (1 - (1 - standardContractDiscount) * 0.80) * 12),
      requirements: ["Enterprise agreement", "1-year RI commitment", "Capacity planning"],
      flexibility: "Medium",
      riskLevel: 'Medium',
      recommendedFor: ["Hybrid optimization", "Balanced risk/reward", "Growing enterprises"]
    },
    {
      scenarioName: "Contract + 3-Year Commitment",
      contractDiscount: enterpriseContractDiscount,
      commitmentDiscount: 0.35,
      combinedDiscount: 1 - (1 - enterpriseContractDiscount) * (1 - 0.35),
      monthlyCost: Math.round(adjustedBaseline * (1 - enterpriseContractDiscount) * 0.65),
      annualCost: Math.round(adjustedBaseline * (1 - enterpriseContractDiscount) * 0.65 * 12),
      savings: Math.round(adjustedBaseline * (1 - (1 - enterpriseContractDiscount) * 0.65) * 12),
      requirements: ["Enterprise agreement", "3-year RI commitment", "Advanced planning"],
      flexibility: "Low",
      riskLevel: 'High',
      recommendedFor: ["Maximum optimization", "Stable enterprises", "Long-term strategy"]
    }
  ]

  const serviceComparisons: ServiceComparison[] = [
    {
      serviceName: "EC2 Compute",
      baselineCost: Math.round(adjustedBaseline * 0.45),
      contractOnly: Math.round(adjustedBaseline * 0.45 * (1 - standardContractDiscount)),
      commitmentOnly: Math.round(adjustedBaseline * 0.45 * 0.75),
      combined: Math.round(adjustedBaseline * 0.45 * (1 - standardContractDiscount) * 0.75),
      bestOption: "Combined",
      maxSavings: Math.round(adjustedBaseline * 0.45 * (standardContractDiscount + 0.25 - standardContractDiscount * 0.25))
    },
    {
      serviceName: "RDS Database",
      baselineCost: Math.round(adjustedBaseline * 0.25),
      contractOnly: Math.round(adjustedBaseline * 0.25 * (1 - standardContractDiscount)),
      commitmentOnly: Math.round(adjustedBaseline * 0.25 * 0.80),
      combined: Math.round(adjustedBaseline * 0.25 * (1 - standardContractDiscount) * 0.80),
      bestOption: "Combined",
      maxSavings: Math.round(adjustedBaseline * 0.25 * (standardContractDiscount + 0.20 - standardContractDiscount * 0.20))
    },
    {
      serviceName: "ElastiCache",
      baselineCost: Math.round(adjustedBaseline * 0.15),
      contractOnly: Math.round(adjustedBaseline * 0.15 * (1 - standardContractDiscount)),
      commitmentOnly: Math.round(adjustedBaseline * 0.15 * 0.85),
      combined: Math.round(adjustedBaseline * 0.15 * (1 - standardContractDiscount) * 0.85),
      bestOption: "Combined", 
      maxSavings: Math.round(adjustedBaseline * 0.15 * (standardContractDiscount + 0.15 - standardContractDiscount * 0.15))
    },
    {
      serviceName: "Storage & Networking",
      baselineCost: Math.round(adjustedBaseline * 0.15),
      contractOnly: Math.round(adjustedBaseline * 0.15 * (1 - standardContractDiscount * 0.7)),
      commitmentOnly: Math.round(adjustedBaseline * 0.15 * 0.95), // Limited RI options
      combined: Math.round(adjustedBaseline * 0.15 * (1 - standardContractDiscount * 0.7) * 0.95),
      bestOption: "Contract Only",
      maxSavings: Math.round(adjustedBaseline * 0.15 * standardContractDiscount * 0.7)
    }
  ]

  const recommendations = {
    immediate: role === 'admin' ? "Negotiate enterprise contract for immediate 12-15% savings" : "Start with standard contract for 8-10% savings",
    shortTerm: "Add 1-year Reserved Instances for stable workloads (20% additional savings)",
    longTerm: "Consider 3-year commitments for production workloads (35% commitment savings)"
  }

  return {
    scenarios,
    serviceComparisons,
    baselineCost: adjustedBaseline,
    recommendations
  }
}

// Component API configuration
const COMMITMENT_CONTRACT_API_CONFIG = {
  relevantFilters: ['dateRange'] as (keyof DashboardFilters)[],
  endpoint: '/api/cost-analytics/commitment-contract-analysis',
  cacheDuration: 30 * 60 * 1000, // 30 minutes
}

export default function CommitmentContractAnalysis() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: analysisData, isLoading, error } = useFilteredData(
    async (filters) => {
      if (!user) throw new Error("User not authenticated")
      return generateCommitmentContractData(filters, user.id, user.role, user.organization)
    },
    COMMITMENT_CONTRACT_API_CONFIG.relevantFilters,
    [user?.id]
  )

  if (isLoading || authLoading || !isAuthenticated) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Commitment vs Contract Analysis</CardTitle>
        <CardDescription>Loading discount strategy analysis...</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full animate-pulse rounded bg-muted"></div>
      </CardContent>
    </Card>
  )

  if (error || !analysisData) return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Commitment vs Contract Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-red-500">{error || "Failed to load analysis data"}</p>
        </div>
      </CardContent>
    </Card>
  )

  const getRiskColor = (risk: string) => {
    return risk === 'Low' ? 'bg-green-100 text-green-800' :
           risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
           'bg-red-100 text-red-800'
  }

  const chartData = analysisData.scenarios.map(scenario => ({
    name: scenario.scenarioName.replace(' - ', '\n'),
    monthlyCost: scenario.monthlyCost,
    savings: scenario.savings / 12,
    combinedDiscount: scenario.combinedDiscount * 100
  }))

  const maxSavings = Math.max(...analysisData.scenarios.map(s => s.savings))

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Handshake className="h-5 w-5" />
          Commitment vs Contract Discount Analysis
        </CardTitle>
        <CardDescription>
          Compare contract negotiations, capacity commitments, and combined strategies for optimal savings
        </CardDescription>
        <div className="flex gap-6 text-sm">
          <div className="text-blue-600 font-medium">
            Baseline: ${analysisData.baselineCost.toLocaleString()}/month
          </div>
          <div className="text-green-600 font-medium">
            Max Annual Savings: ${maxSavings.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Comparison Chart */}
        <div>
          <h4 className="font-semibold mb-4">Monthly Cost Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
              />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  name === 'monthlyCost' ? `$${value.toLocaleString()}` : `$${value.toLocaleString()}`,
                  name === 'monthlyCost' ? 'Monthly Cost' : 'Monthly Savings'
                ]}
              />
              <Legend />
              <Bar dataKey="monthlyCost" fill="#3b82f6" name="Monthly Cost" />
              <Bar dataKey="savings" fill="#22c55e" name="Monthly Savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scenarios Comparison */}
        <div>
          <h4 className="font-semibold mb-4">Detailed Scenario Analysis</h4>
          <div className="grid gap-4">
            {analysisData.scenarios.map((scenario, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {scenario.contractDiscount > 0 && <Handshake className="h-4 w-4 text-blue-600" />}
                      {scenario.commitmentDiscount > 0 && <Clock className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <h5 className="font-semibold">{scenario.scenarioName}</h5>
                      <p className="text-sm text-muted-foreground">
                        Flexibility: {scenario.flexibility}
                      </p>
                    </div>
                  </div>
                  <Badge className={getRiskColor(scenario.riskLevel)}>
                    {scenario.riskLevel} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Monthly Cost</div>
                    <div className="font-semibold">${scenario.monthlyCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Annual Savings</div>
                    <div className="font-semibold text-green-600">${scenario.savings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Discount</div>
                    <div className="font-semibold text-purple-600">{(scenario.combinedDiscount * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Contract + Commitment</div>
                    <div className="text-sm">
                      {(scenario.contractDiscount * 100).toFixed(1)}% + {(scenario.commitmentDiscount * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Savings Potential</span>
                    <span>{((scenario.savings / maxSavings) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={(scenario.savings / maxSavings) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Requirements:</div>
                    <ul className="text-xs space-y-1">
                      {scenario.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Recommended For:</div>
                    <div className="flex flex-wrap gap-1">
                      {scenario.recommendedFor.map((rec, recIndex) => (
                        <Badge key={recIndex} variant="outline" className="text-xs">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service-Specific Analysis */}
        <div>
          <h4 className="font-semibold mb-4">Service-Specific Comparison</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Baseline Cost</TableHead>
                  <TableHead>Contract Only</TableHead>
                  <TableHead>Commitment Only</TableHead>
                  <TableHead>Combined</TableHead>
                  <TableHead>Best Option</TableHead>
                  <TableHead>Max Savings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysisData.serviceComparisons.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{service.serviceName}</TableCell>
                    <TableCell>${service.baselineCost.toLocaleString()}</TableCell>
                    <TableCell className="text-orange-600">
                      ${service.contractOnly.toLocaleString()}
                      <div className="text-xs text-muted-foreground">
                        -{((1 - service.contractOnly / service.baselineCost) * 100).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-600">
                      ${service.commitmentOnly.toLocaleString()}
                      <div className="text-xs text-muted-foreground">
                        -{((1 - service.commitmentOnly / service.baselineCost) * 100).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-green-600">
                      ${service.combined.toLocaleString()}
                      <div className="text-xs text-muted-foreground">
                        -{((1 - service.combined / service.baselineCost) * 100).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-600">
                        {service.bestOption}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      ${service.maxSavings.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Strategic Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-700 mb-2">Immediate (0-3 months)</div>
              <p className="text-blue-600">{analysisData.recommendations.immediate}</p>
            </div>
            <div>
              <div className="font-medium text-blue-700 mb-2">Short-term (3-12 months)</div>
              <p className="text-blue-600">{analysisData.recommendations.shortTerm}</p>
            </div>
            <div>
              <div className="font-medium text-blue-700 mb-2">Long-term (1-3 years)</div>
              <p className="text-blue-600">{analysisData.recommendations.longTerm}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}