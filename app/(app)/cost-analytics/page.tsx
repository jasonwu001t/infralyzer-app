"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Calculator,
  Download,
  RefreshCw,
  Filter,
  Search,
  PieChart,
  Target,
  ArrowUp,
  ArrowDown,
  Info,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  Award,
  CreditCard,
  Receipt,
  Banknote,
  Coins,
  Tag,
  TrendingDownIcon,
  Activity,
  Calendar,
  Clock,
  Gauge,
  LineChart,
  Users,
  Building
} from 'lucide-react'

interface CostBreakdown {
  service: string
  listCost: number
  billedCost: number
  contractedCost: number
  effectiveCost: number
  publicEquivalentBilledCost: number
  publicEquivalentEffectiveCost: number
  listRate: number
  billedRate: number
  contractedRate: number
  effectiveRate: number
  publicEquivalentBilledRate: number
  publicEquivalentEffectiveRate: number
  usage: number
  usageUnit: string
  discountPercentage: number
  commitmentSavings: number
  trend: 'up' | 'down' | 'stable'
  monthlyGrowth: number
}

export default function CostAnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedService, setSelectedService] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Enhanced demo data for cost breakdown with trends and additional metrics
  const costBreakdown: CostBreakdown[] = [
    {
      service: 'Amazon EC2',
      listCost: 15420.50,
      billedCost: 12336.40,
      contractedCost: 11502.30,
      effectiveCost: 10987.60,
      publicEquivalentBilledCost: 13125.20,
      publicEquivalentEffectiveCost: 12456.80,
      listRate: 0.096,
      billedRate: 0.077,
      contractedRate: 0.072,
      effectiveRate: 0.069,
      publicEquivalentBilledRate: 0.082,
      publicEquivalentEffectiveRate: 0.078,
      usage: 160630,
      usageUnit: 'hours',
      discountPercentage: 28.7,
      commitmentSavings: 3084.20,
      trend: 'up',
      monthlyGrowth: 12.5
    },
    {
      service: 'Amazon RDS',
      listCost: 8750.00,
      billedCost: 7875.00,
      contractedCost: 7350.00,
      effectiveCost: 7012.50,
      publicEquivalentBilledCost: 8312.50,
      publicEquivalentEffectiveCost: 7893.75,
      listRate: 0.125,
      billedRate: 0.113,
      contractedRate: 0.105,
      effectiveRate: 0.100,
      publicEquivalentBilledRate: 0.119,
      publicEquivalentEffectiveRate: 0.113,
      usage: 70000,
      usageUnit: 'hours',
      discountPercentage: 19.9,
      commitmentSavings: 1237.50,
      trend: 'stable',
      monthlyGrowth: 2.1
    },
    {
      service: 'Amazon S3',
      listCost: 2340.80,
      billedCost: 2106.72,
      contractedCost: 1872.64,
      effectiveCost: 1755.60,
      publicEquivalentBilledCost: 2223.76,
      publicEquivalentEffectiveCost: 2012.46,
      listRate: 0.023,
      billedRate: 0.021,
      contractedRate: 0.019,
      effectiveRate: 0.018,
      publicEquivalentBilledRate: 0.022,
      publicEquivalentEffectiveRate: 0.020,
      usage: 98765,
      usageUnit: 'GB',
      discountPercentage: 25.0,
      commitmentSavings: 585.20,
      trend: 'down',
      monthlyGrowth: -5.2
    },
    {
      service: 'Amazon Lambda',
      listCost: 1845.30,
      billedCost: 1660.77,
      contractedCost: 1476.24,
      effectiveCost: 1384.98,
      publicEquivalentBilledCost: 1752.03,
      publicEquivalentEffectiveCost: 1568.23,
      listRate: 0.0000002,
      billedRate: 0.00000018,
      contractedRate: 0.00000016,
      effectiveRate: 0.00000015,
      publicEquivalentBilledRate: 0.00000019,
      publicEquivalentEffectiveRate: 0.00000017,
      usage: 9226500000,
      usageUnit: 'requests',
      discountPercentage: 24.9,
      commitmentSavings: 460.32,
      trend: 'up',
      monthlyGrowth: 18.3
    },
    {
      service: 'Amazon CloudFront',
      listCost: 892.45,
      billedCost: 803.21,
      contractedCost: 714.96,
      effectiveCost: 669.84,
      publicEquivalentBilledCost: 847.83,
      publicEquivalentEffectiveCost: 758.08,
      listRate: 0.085,
      billedRate: 0.077,
      contractedRate: 0.068,
      effectiveRate: 0.064,
      publicEquivalentBilledRate: 0.081,
      publicEquivalentEffectiveRate: 0.072,
      usage: 10499,
      usageUnit: 'GB',
      discountPercentage: 24.9,
      commitmentSavings: 222.61,
      trend: 'stable',
      monthlyGrowth: 1.2
    }
  ]

  // Calculate totals
  const totalCosts = costBreakdown.reduce((acc, item) => ({
    listCost: acc.listCost + item.listCost,
    billedCost: acc.billedCost + item.billedCost,
    contractedCost: acc.contractedCost + item.contractedCost,
    effectiveCost: acc.effectiveCost + item.effectiveCost,
    publicEquivalentBilledCost: acc.publicEquivalentBilledCost + item.publicEquivalentBilledCost,
    publicEquivalentEffectiveCost: acc.publicEquivalentEffectiveCost + item.publicEquivalentEffectiveCost,
    commitmentSavings: acc.commitmentSavings + item.commitmentSavings
  }), {
    listCost: 0,
    billedCost: 0,
    contractedCost: 0,
    effectiveCost: 0,
    publicEquivalentBilledCost: 0,
    publicEquivalentEffectiveCost: 0,
    commitmentSavings: 0
  })

  const overallDiscountPercentage = ((totalCosts.listCost - totalCosts.effectiveCost) / totalCosts.listCost) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatRate = (rate: number, unit: string) => {
    if (unit === 'requests') {
      return `$${(rate * 1000000).toFixed(4)}/M requests`
    }
    return `$${rate.toFixed(4)}/${unit}`
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const filteredCostBreakdown = costBreakdown.filter(item => 
    (selectedService === 'all' || item.service === selectedService) &&
    (searchTerm === '' || item.service.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <div>
        <h1 className="text-3xl font-bold tracking-tight">Cost Analytics</h1>
          <p className="text-muted-foreground">
            Advanced cost performance analysis across all cost types and rate structures
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px]"
            />
          </div>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {costBreakdown.map(item => (
                <SelectItem key={item.service} value={item.service}>
                  {item.service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Executive Cost Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effective Cost</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCosts.effectiveCost)}</div>
            <p className="text-xs text-muted-foreground">Amortized & optimized</p>
            <div className="flex items-center pt-1">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">-{overallDiscountPercentage.toFixed(1)}% vs list</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCosts.listCost - totalCosts.effectiveCost)}
            </div>
            <p className="text-xs text-muted-foreground">Monthly savings achieved</p>
            <div className="flex items-center pt-1">
              <Gauge className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600">{overallDiscountPercentage.toFixed(1)}% discount rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commitment Savings</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalCosts.commitmentSavings)}
            </div>
            <p className="text-xs text-muted-foreground">From RIs & Savings Plans</p>
            <div className="flex items-center pt-1">
              <Shield className="h-3 w-3 text-purple-500 mr-1" />
              <span className="text-xs text-purple-600">
                {((totalCosts.commitmentSavings / totalCosts.effectiveCost) * 100).toFixed(1)}% of effective cost
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Advantage</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalCosts.publicEquivalentEffectiveCost - totalCosts.effectiveCost)}
            </div>
            <p className="text-xs text-muted-foreground">vs public pricing</p>
            <div className="flex items-center pt-1">
              <Users className="h-3 w-3 text-orange-500 mr-1" />
              <span className="text-xs text-orange-600">
                {(((totalCosts.publicEquivalentEffectiveCost - totalCosts.effectiveCost) / totalCosts.publicEquivalentEffectiveCost) * 100).toFixed(1)}% private discount
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs - Reduced from 5 to 3 comprehensive tabs */}
      <Tabs defaultValue="cost-performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cost-performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Cost Performance
          </TabsTrigger>
          <TabsTrigger value="rate-discount-analysis" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Rate & Discount Analysis
          </TabsTrigger>
          <TabsTrigger value="commitments-optimization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Commitments & Optimization
          </TabsTrigger>
        </TabsList>

        {/* Cost Performance Tab */}
        <TabsContent value="cost-performance" className="space-y-6">
          {/* Cost Type Comparison */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Cost Type Waterfall Analysis
                </CardTitle>
                <CardDescription>Progressive cost reduction from list to effective pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">List Cost</span>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(totalCosts.listCost)}</span>
                  </div>
                  <Progress value={100} className="h-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Billed Cost</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{formatCurrency(totalCosts.billedCost)}</span>
                      <div className="text-xs text-green-600">
                        -{formatCurrency(totalCosts.listCost - totalCosts.billedCost)} volume discount
                      </div>
                    </div>
                  </div>
                  <Progress value={(totalCosts.billedCost / totalCosts.listCost) * 100} className="h-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Contracted Cost</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold">{formatCurrency(totalCosts.contractedCost)}</span>
                      <div className="text-xs text-green-600">
                        -{formatCurrency(totalCosts.billedCost - totalCosts.contractedCost)} enterprise discount
                      </div>
                    </div>
                  </div>
                  <Progress value={(totalCosts.contractedCost / totalCosts.listCost) * 100} className="h-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Effective Cost</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(totalCosts.effectiveCost)}</span>
                      <div className="text-xs text-green-600">
                        -{formatCurrency(totalCosts.contractedCost - totalCosts.effectiveCost)} commitment savings
                      </div>
                    </div>
                  </div>
                  <Progress value={(totalCosts.effectiveCost / totalCosts.listCost) * 100} className="h-3" />
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-green-700">Total Savings</span>
                      <span className="text-green-700 text-lg">
                        {formatCurrency(totalCosts.listCost - totalCosts.effectiveCost)}
                      </span>
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-1">
                      {overallDiscountPercentage.toFixed(1)}% total discount rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Service Cost Distribution & Trends
                </CardTitle>
                <CardDescription>Cost breakdown by service with performance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCostBreakdown.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.service}</span>
                          {getTrendIcon(item.trend)}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{formatCurrency(item.effectiveCost)}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <span className={item.monthlyGrowth > 0 ? 'text-red-600' : 'text-green-600'}>
                              {item.monthlyGrowth > 0 ? '+' : ''}{item.monthlyGrowth.toFixed(1)}%
                            </span>
                            <span className="text-muted-foreground">vs last month</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={(item.effectiveCost / totalCosts.effectiveCost) * 100} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{((item.effectiveCost / totalCosts.effectiveCost) * 100).toFixed(1)}% of total effective cost</span>
                        <span className="text-green-600">-{item.discountPercentage.toFixed(1)}% vs list price</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Cost Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Comprehensive Cost Breakdown Matrix
              </CardTitle>
              <CardDescription>Complete cost type comparison with rates and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[140px]">Service</TableHead>
                      <TableHead className="text-right">List Cost</TableHead>
                      <TableHead className="text-right">Billed Cost</TableHead>
                      <TableHead className="text-right">Contracted Cost</TableHead>
                      <TableHead className="text-right">Effective Cost</TableHead>
                      <TableHead className="text-right">Total Discount</TableHead>
                      <TableHead className="text-right">Usage</TableHead>
                      <TableHead className="text-right">Effective Rate</TableHead>
                      <TableHead className="text-center">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCostBreakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.service}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.listCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.billedCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.contractedCost)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(item.effectiveCost)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="text-green-800 bg-green-100">
                            -{item.discountPercentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.usage.toLocaleString()} {item.usageUnit}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatRate(item.effectiveRate, item.usageUnit)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getTrendIcon(item.trend)}
                            <span className={`text-xs ${item.monthlyGrowth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.monthlyGrowth > 0 ? '+' : ''}{item.monthlyGrowth.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Type Definitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Cost Type Definitions & Business Impact
              </CardTitle>
              <CardDescription>Understanding different cost calculation methodologies and their business implications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Receipt className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-900">List Cost</span>
                  </div>
                  <p className="text-sm text-red-700 mb-2">
                    Published on-demand pricing before any discounts. Used for budget planning and cost comparison.
                  </p>
                  <div className="text-lg font-bold text-red-900">{formatCurrency(totalCosts.listCost)}</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Billed Cost</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Actual invoiced amount including volume discounts. What appears on your AWS bill.
                  </p>
                  <div className="text-lg font-bold text-blue-900">{formatCurrency(totalCosts.billedCost)}</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Contracted Cost</span>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">
                    Cost with enterprise agreements and private pricing. Includes negotiated discounts.
                  </p>
                  <div className="text-lg font-bold text-purple-900">{formatCurrency(totalCosts.contractedCost)}</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Effective Cost</span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    True cost including amortized commitments and all optimizations. Best metric for cost management.
                  </p>
                  <div className="text-lg font-bold text-green-900">{formatCurrency(totalCosts.effectiveCost)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate & Discount Analysis Tab */}
        <TabsContent value="rate-discount-analysis" className="space-y-6">
          {/* Rate Analysis Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Rate Performance Analysis
                </CardTitle>
                <CardDescription>Unit rate optimization across services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCostBreakdown.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{item.service}</h4>
                        <Badge variant="secondary" className="text-green-800 bg-green-100">
                          -{item.discountPercentage.toFixed(1)}% rate reduction
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">List Rate</div>
                          <div className="font-mono text-sm font-medium">
                            {formatRate(item.listRate, item.usageUnit)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Effective Rate</div>
                          <div className="font-mono text-sm font-medium text-green-600">
                            {formatRate(item.effectiveRate, item.usageUnit)}
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={(item.effectiveRate / item.listRate) * 100} 
                        className="h-2"
                      />
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Usage: {item.usage.toLocaleString()} {item.usageUnit}</span>
                        <span>Savings: {formatCurrency(item.listCost - item.effectiveCost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Discount Impact Breakdown
                </CardTitle>
                <CardDescription>Detailed discount analysis by type and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(((totalCosts.listCost - totalCosts.billedCost) / totalCosts.listCost) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-800">Volume Discounts</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(totalCosts.listCost - totalCosts.billedCost)}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {(((totalCosts.billedCost - totalCosts.contractedCost) / totalCosts.listCost) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-purple-800">Enterprise Discount</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(totalCosts.billedCost - totalCosts.contractedCost)}
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {(((totalCosts.contractedCost - totalCosts.effectiveCost) / totalCosts.listCost) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-green-800">Commitment Savings</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(totalCosts.contractedCost - totalCosts.effectiveCost)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Service-Level Discount Performance</h4>
                    {filteredCostBreakdown
                      .sort((a, b) => b.discountPercentage - a.discountPercentage)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{item.service}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(item.listCost)} → {formatCurrency(item.effectiveCost)}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="text-green-800 bg-green-100">
                              -{item.discountPercentage.toFixed(1)}%
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(item.listCost - item.effectiveCost)} saved
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Public vs Private Pricing Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Public vs Private Pricing Analysis
              </CardTitle>
              <CardDescription>Comparison of your private pricing against public cloud rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-orange-50 rounded-lg border">
                    <div className="text-3xl font-bold text-orange-600">
                      {formatCurrency(totalCosts.publicEquivalentEffectiveCost - totalCosts.effectiveCost)}
                    </div>
                    <div className="text-sm text-orange-800 font-medium">Monthly Private Advantage</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(((totalCosts.publicEquivalentEffectiveCost - totalCosts.effectiveCost) / totalCosts.publicEquivalentEffectiveCost) * 100).toFixed(1)}% additional savings
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(totalCosts.publicEquivalentEffectiveCost)}
                    </div>
                    <div className="text-sm text-blue-800 font-medium">Public Equivalent Cost</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      What you'd pay on public cloud
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(totalCosts.effectiveCost)}
                    </div>
                    <div className="text-sm text-green-800 font-medium">Your Effective Cost</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Actual optimized cost
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Public Rate</TableHead>
                        <TableHead className="text-right">Your Rate</TableHead>
                        <TableHead className="text-right">Private Advantage</TableHead>
                        <TableHead className="text-right">Monthly Savings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCostBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.service}</TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {formatRate(item.publicEquivalentEffectiveRate, item.usageUnit)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-green-600">
                            {formatRate(item.effectiveRate, item.usageUnit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="text-orange-800 bg-orange-100">
                              -{(((item.publicEquivalentEffectiveRate - item.effectiveRate) / item.publicEquivalentEffectiveRate) * 100).toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium text-orange-600">
                            {formatCurrency(item.publicEquivalentEffectiveCost - item.effectiveCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commitments & Optimization Tab */}
        <TabsContent value="commitments-optimization" className="space-y-6">
          {/* Commitment Performance Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Commitment Savings Performance
                </CardTitle>
                <CardDescription>Reserved Instance and Savings Plans impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(totalCosts.commitmentSavings)}
                    </div>
                    <div className="text-sm text-blue-800 font-medium">Total Monthly Commitment Savings</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((totalCosts.commitmentSavings / (totalCosts.effectiveCost + totalCosts.commitmentSavings)) * 100).toFixed(1)}% of pre-commitment cost
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Commitment Savings by Service</h4>
                    {filteredCostBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{item.service}</div>
                          <div className="text-sm text-muted-foreground">
                            {((item.commitmentSavings / item.effectiveCost) * 100).toFixed(1)}% of effective cost
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-blue-600">
                            {formatCurrency(item.commitmentSavings)}
                          </div>
                          <div className="text-xs text-muted-foreground">monthly savings</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Optimization Opportunities
                </CardTitle>
                <CardDescription>Potential additional savings and optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg border">
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(
                          filteredCostBreakdown.reduce((acc, item) => 
                            acc + (item.effectiveCost * 0.15), 0
                          )
                        )}
                      </div>
                      <div className="text-sm text-green-800">Potential Savings</div>
                      <div className="text-xs text-muted-foreground">15% optimization target</div>
                    </div>
                    
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border">
                      <div className="text-xl font-bold text-yellow-600">
                        {filteredCostBreakdown.filter(item => item.trend === 'up').length}
                      </div>
                      <div className="text-sm text-yellow-800">Services Growing</div>
                      <div className="text-xs text-muted-foreground">Need attention</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Service Optimization Recommendations</h4>
                    {filteredCostBreakdown.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{item.service}</div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(item.trend)}
                            <span className={`text-sm ${item.monthlyGrowth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.monthlyGrowth > 0 ? '+' : ''}{item.monthlyGrowth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {item.discountPercentage < 20 ? (
                            <div className="text-yellow-600">
                              ⚠️ Low discount rate - consider increasing commitment coverage
                            </div>
                          ) : item.monthlyGrowth > 10 ? (
                            <div className="text-red-600">
                              📈 High growth - monitor for unexpected usage spikes
                            </div>
                          ) : (
                            <div className="text-green-600">
                              ✅ Well optimized - continue monitoring
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          Potential monthly savings: {formatCurrency(item.effectiveCost * 0.15)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Savings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Comprehensive Savings Analysis
              </CardTitle>
              <CardDescription>Complete breakdown of all savings mechanisms and their impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Savings Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium">Volume Discounts</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(totalCosts.listCost - totalCosts.billedCost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium">Enterprise Agreements</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(totalCosts.billedCost - totalCosts.contractedCost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Commitment Savings</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(totalCosts.commitmentSavings)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <span className="text-sm font-medium">Private Pricing Advantage</span>
                      <span className="font-bold text-orange-600">
                        {formatCurrency(totalCosts.publicEquivalentEffectiveCost - totalCosts.effectiveCost)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total Monthly Savings</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(
                          (totalCosts.listCost - totalCosts.effectiveCost) + 
                          (totalCosts.publicEquivalentEffectiveCost - totalCosts.effectiveCost)
                        )}
                      </span>
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      vs public list pricing
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Annual Impact Projection</h4>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 rounded-lg border">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency((totalCosts.listCost - totalCosts.effectiveCost) * 12)}
                      </div>
                      <div className="text-sm text-green-800">Annual Savings Achieved</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(
                          filteredCostBreakdown.reduce((acc, item) => 
                            acc + (item.effectiveCost * 0.15), 0
                          ) * 12
                        )}
                      </div>
                      <div className="text-sm text-blue-800">Additional Potential</div>
                      <div className="text-xs text-muted-foreground">With further optimization</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium mb-2">Optimization Score</div>
                    <Progress value={overallDiscountPercentage} className="h-3 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{overallDiscountPercentage.toFixed(1)}% optimized</span>
                      <span>Target: 35%+</span>
                    </div>
                  </div>
                </div>
      </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}