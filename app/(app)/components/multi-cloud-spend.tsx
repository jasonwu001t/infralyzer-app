"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Cloud, TrendingUp, TrendingDown } from "lucide-react"

interface CloudProvider {
  name: string
  logo: string
  monthlySpend: number
  percentage: number
  instances: number
  averageCostPerInstance: number
  storage: number
  averageCostPerGB: number
  dataTransfer: number
  averageCostPerGB_DT: number
  trend: 'up' | 'down' | 'stable'
  monthlyChange: number
}

export default function MultiCloudSpend() {
  // Mock data for multi-cloud unit economics
  const cloudProviders: CloudProvider[] = [
    {
      name: 'AWS',
      logo: '🟠',
      monthlySpend: 285000,
      percentage: 68,
      instances: 245,
      averageCostPerInstance: 1163,
      storage: 15000,
      averageCostPerGB: 0.023,
      dataTransfer: 8500,
      averageCostPerGB_DT: 0.09,
      trend: 'up',
      monthlyChange: 12.5
    },
    {
      name: 'Azure',
      logo: '🔵',
      monthlySpend: 98000,
      percentage: 23,
      instances: 89,
      averageCostPerInstance: 1101,
      storage: 6200,
      averageCostPerGB: 0.021,
      dataTransfer: 2800,
      averageCostPerGB_DT: 0.087,
      trend: 'up',
      monthlyChange: 8.2
    },
    {
      name: 'GCP',
      logo: '🟡',
      monthlySpend: 38000,
      percentage: 9,
      instances: 34,
      averageCostPerInstance: 1118,
      storage: 2400,
      averageCostPerGB: 0.020,
      dataTransfer: 1200,
      averageCostPerGB_DT: 0.085,
      trend: 'stable',
      monthlyChange: 1.8
    }
  ]

  const totalSpend = cloudProviders.reduce((sum, provider) => sum + provider.monthlySpend, 0)
  const totalInstances = cloudProviders.reduce((sum, provider) => sum + provider.instances, 0)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />
      default: return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  const getBestValue = (metric: keyof CloudProvider, isLowerBetter: boolean = true) => {
    const values = cloudProviders.map(p => p[metric] as number)
    const bestValue = isLowerBetter ? Math.min(...values) : Math.max(...values)
    return bestValue
  }

  const isOptimal = (value: number, metric: keyof CloudProvider, isLowerBetter: boolean = true) => {
    const bestValue = getBestValue(metric, isLowerBetter)
    return value === bestValue
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>Multi-Cloud Unit Economics</span>
          </div>
          <Badge variant="outline" className="text-xs">
            ${totalSpend.toLocaleString()}/mo total
          </Badge>
        </CardTitle>
        <CardDescription>
          Cost efficiency comparison across cloud providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Overview */}
        <div className="grid grid-cols-3 gap-3">
          {cloudProviders.map((provider) => (
            <div key={provider.name} className="text-center p-3 border rounded-lg">
              <div className="text-2xl mb-1">{provider.logo}</div>
              <div className="font-medium text-sm">{provider.name}</div>
              <div className="text-lg font-bold">${provider.monthlySpend.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{provider.percentage}% of total</div>
              <Progress value={provider.percentage} className="h-1 mt-1" />
            </div>
          ))}
        </div>

        {/* Unit Economics Table */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Unit Cost Analysis:</div>
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="h-8">Provider</TableHead>
                <TableHead className="h-8">Instances</TableHead>
                <TableHead className="h-8">Cost/Instance</TableHead>
                <TableHead className="h-8">Storage (GB)</TableHead>
                <TableHead className="h-8">Cost/GB Storage</TableHead>
                <TableHead className="h-8">Cost/GB Transfer</TableHead>
                <TableHead className="h-8">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cloudProviders.map((provider) => (
                <TableRow key={provider.name} className="text-xs">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{provider.logo}</span>
                      <span>{provider.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{provider.instances}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>${provider.averageCostPerInstance}</span>
                      {isOptimal(provider.averageCostPerInstance, 'averageCostPerInstance') && (
                        <Badge variant="default" className="text-xs px-1">Best</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{provider.storage.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>${provider.averageCostPerGB.toFixed(3)}</span>
                      {isOptimal(provider.averageCostPerGB, 'averageCostPerGB') && (
                        <Badge variant="default" className="text-xs px-1">Best</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>${provider.averageCostPerGB_DT.toFixed(3)}</span>
                      {isOptimal(provider.averageCostPerGB_DT, 'averageCostPerGB_DT') && (
                        <Badge variant="default" className="text-xs px-1">Best</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(provider.trend)}
                      <span className={provider.trend === 'up' ? 'text-red-600' : provider.trend === 'down' ? 'text-green-600' : 'text-gray-600'}>
                        {provider.monthlyChange > 0 ? '+' : ''}{provider.monthlyChange}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Cost Optimization Insights */}
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium">Cost Optimization Opportunities:</div>
          <div className="space-y-1 text-xs">
            <div className="text-blue-600">• GCP offers lowest storage costs at $0.020/GB vs AWS $0.023/GB</div>
            <div className="text-green-600">• Azure has competitive compute pricing with similar performance</div>
            <div className="text-orange-600">• Consider workload migration to optimize for specific service strengths</div>
            <div className="text-purple-600">• Multi-cloud strategy reduces vendor lock-in and enables cost arbitrage</div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Instances:</span>
            <span className="font-medium">{totalInstances}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg Cost/Instance:</span>
            <span className="font-medium">${Math.round(totalSpend / totalInstances)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
