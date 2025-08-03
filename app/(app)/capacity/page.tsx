"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Activity,
  Clock,
  Database,
  Zap,
  Download,
  RefreshCw,
  Target,
  Gauge,
  Calendar,
  Users,
  Cloud,
  AlertCircle,
  Info,
  ArrowUp,
  ArrowDown,
  DollarSign
} from 'lucide-react'

interface CapacityMetric {
  name: string
  current: number
  capacity: number
  trend: number
  status: 'healthy' | 'warning' | 'critical'
  forecast: number
}

interface ResourceRecommendation {
  resource: string
  type: string
  action: string
  impact: string
  savings: number
  priority: 'high' | 'medium' | 'low'
}

export default function CapacityManagementPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [selectedEnvironment, setSelectedEnvironment] = useState('all')

  // Demo data for capacity metrics
  const capacityMetrics: CapacityMetric[] = [
    { name: 'CPU Utilization', current: 68, capacity: 100, trend: 5.2, status: 'healthy', forecast: 72 },
    { name: 'Memory Usage', current: 84, capacity: 100, trend: -2.1, status: 'warning', forecast: 89 },
    { name: 'Storage Usage', current: 92, capacity: 100, trend: 8.7, status: 'critical', forecast: 98 },
    { name: 'Network I/O', current: 45, capacity: 100, trend: 12.3, status: 'healthy', forecast: 52 },
  ]

  // Demo data for resource recommendations
  const recommendations: ResourceRecommendation[] = [
    {
      resource: 'prod-web-cluster',
      type: 'EC2',
      action: 'Right-size to m5.xlarge',
      impact: 'Reduce costs by 30%',
      savings: 2400,
      priority: 'high'
    },
    {
      resource: 'analytics-db',
      type: 'RDS',
      action: 'Upgrade to db.r5.2xlarge',
      impact: 'Improve performance',
      savings: -800,
      priority: 'medium'
    },
    {
      resource: 'backup-storage',
      type: 'S3',
      action: 'Move to IA storage class',
      impact: 'Reduce storage costs',
      savings: 1200,
      priority: 'low'
    },
    {
      resource: 'dev-instances',
      type: 'EC2',
      action: 'Schedule shutdown',
      impact: 'Save on unused capacity',
      savings: 1800,
      priority: 'high'
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Capacity Management</h1>
          <p className="text-muted-foreground">
            Monitor resource utilization, forecast capacity needs, and optimize infrastructure efficiency
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Environments</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
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

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {capacityMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getStatusIcon(metric.status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{metric.current}%</div>
              <Progress value={metric.current} className="mb-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Capacity: {metric.capacity}%</span>
                <div className="flex items-center">
                  {metric.trend > 0 ? (
                    <ArrowUp className="h-3 w-3 text-red-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                  )}
                  <span className={metric.trend > 0 ? 'text-red-500' : 'text-green-500'}>
                    {Math.abs(metric.trend)}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Forecast: {metric.forecast}% (7 days)
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Resource Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resource Distribution by Service
                </CardTitle>
                <CardDescription>Current resource allocation across AWS services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EC2 Instances</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RDS Databases</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EBS Storage</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lambda Functions</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other Services</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Capacity Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Capacity Trends (7 Days)
                </CardTitle>
                <CardDescription>Resource utilization trends and projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Storage</span>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Memory</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">CPU</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Network</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Environment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Environment Summary
              </CardTitle>
              <CardDescription>Resource utilization across different environments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Production</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">High Load</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU: 78%</span>
                      <span>Memory: 85%</span>
                    </div>
                    <Progress value={78} className="h-1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Staging</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Load</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU: 45%</span>
                      <span>Memory: 52%</span>
                    </div>
                    <Progress value={45} className="h-1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Development</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Low Load</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>CPU: 23%</span>
                      <span>Memory: 31%</span>
                    </div>
                    <Progress value={23} className="h-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilization Tab */}
        <TabsContent value="utilization" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Resource Monitor</CardTitle>
                <CardDescription>Live utilization across all resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={351.86}
                          strokeDashoffset={87.97}
                          className="text-blue-600"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">75%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Overall Utilization</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">1,247</div>
                      <div className="text-xs text-muted-foreground">Active Instances</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">$18,450</div>
                      <div className="text-xs text-muted-foreground">Monthly Cost</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Patterns</CardTitle>
                <CardDescription>Historical usage patterns and peak times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Hours</span>
                    <span className="text-sm font-medium">9 AM - 6 PM EST</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Monday</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Tuesday</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Wednesday</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Thursday</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Friday</span>
                      <span>79%</span>
                    </div>
                    <Progress value={79} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">94%</div>
                      <div className="text-xs text-muted-foreground">Peak Usage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">23%</div>
                      <div className="text-xs text-muted-foreground">Off-Peak</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Capacity Forecast (Next 3 Months)
                </CardTitle>
                <CardDescription>Projected resource needs based on historical trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">CPU Capacity</span>
                      <Badge variant="secondary">+15% growth</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: 68% → Projected: 83% (Dec 2024)
                    </div>
                    <Progress value={68} className="mt-2" />
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Storage Capacity</span>
                      <Badge variant="destructive">Action Needed</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: 92% → Projected: 98% (Nov 2024)
                    </div>
                    <Progress value={92} className="mt-2" />
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Network Capacity</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: 45% → Projected: 52% (Dec 2024)
                    </div>
                    <Progress value={45} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Growth Projections
                </CardTitle>
                <CardDescription>Expected resource growth patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Instance Count Growth</span>
                      <span className="text-sm text-muted-foreground">+12% monthly</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold">1,247</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-lg font-semibold">1,397</div>
                        <div className="text-xs text-muted-foreground">Next Month</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <div className="text-lg font-semibold">1,742</div>
                        <div className="text-xs text-muted-foreground">3 Months</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Storage Growth</span>
                      <span className="text-sm text-muted-foreground">+8.5% monthly</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-lg font-semibold">24.5 TB</div>
                        <div className="text-xs text-muted-foreground">Current</div>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-lg font-semibold">26.6 TB</div>
                        <div className="text-xs text-muted-foreground">Next Month</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <div className="text-lg font-semibold">32.1 TB</div>
                        <div className="text-xs text-muted-foreground">3 Months</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Right-sizing Recommendations
              </CardTitle>
              <CardDescription>AI-powered recommendations to optimize resource allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Savings</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((rec, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{rec.resource}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rec.type}</Badge>
                      </TableCell>
                      <TableCell>{rec.action}</TableCell>
                      <TableCell>{rec.impact}</TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 ${rec.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <DollarSign className="h-4 w-4" />
                          {rec.savings > 0 ? '+' : ''}{rec.savings}/mo
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resource Efficiency Score
                </CardTitle>
                <CardDescription>Overall efficiency metrics for your infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-muted-foreground">Overall Efficiency</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CPU Efficiency</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Memory Efficiency</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Efficiency</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Resource Allocation
                </CardTitle>
                <CardDescription>Resource usage by team and department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Engineering</div>
                      <div className="text-sm text-muted-foreground">152 instances</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$8,240/mo</div>
                      <div className="text-sm text-muted-foreground">45% of total</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Data Science</div>
                      <div className="text-sm text-muted-foreground">89 instances</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$5,120/mo</div>
                      <div className="text-sm text-muted-foreground">28% of total</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium">DevOps</div>
                      <div className="text-sm text-muted-foreground">67 instances</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$3,890/mo</div>
                      <div className="text-sm text-muted-foreground">21% of total</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <div className="font-medium">QA Testing</div>
                      <div className="text-sm text-muted-foreground">28 instances</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">$1,200/mo</div>
                      <div className="text-sm text-muted-foreground">6% of total</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Critical Alerts
                </CardTitle>
                <CardDescription>Immediate attention required</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">Storage Capacity Critical</div>
                      <div className="text-sm text-red-700">prod-db-cluster storage at 95% capacity</div>
                      <div className="text-xs text-red-600 mt-1">2 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">Memory Pressure</div>
                      <div className="text-sm text-red-700">web-server-01 memory usage at 98%</div>
                      <div className="text-xs text-red-600 mt-1">5 minutes ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">Instance Unresponsive</div>
                      <div className="text-sm text-red-700">analytics-worker-03 not responding</div>
                      <div className="text-xs text-red-600 mt-1">12 minutes ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Warning Alerts
                </CardTitle>
                <CardDescription>Approaching thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-900">High CPU Usage</div>
                      <div className="text-sm text-yellow-700">api-server-cluster averaging 85% CPU</div>
                      <div className="text-xs text-yellow-600 mt-1">1 hour ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-900">Disk Space Low</div>
                      <div className="text-sm text-yellow-700">backup-server disk usage at 80%</div>
                      <div className="text-xs text-yellow-600 mt-1">3 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-yellow-900">Network Latency</div>
                      <div className="text-sm text-yellow-700">Increased latency to us-west-2</div>
                      <div className="text-xs text-yellow-600 mt-1">6 hours ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>Manage thresholds and notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">CPU Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Warning</span>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Memory Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Warning</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Storage Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Warning</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Network Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Warning</span>
                      <span className="text-sm font-medium">70%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex gap-2">
                  <Button variant="outline">
                    Configure Notifications
                  </Button>
                  <Button variant="outline">
                    Update Thresholds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}