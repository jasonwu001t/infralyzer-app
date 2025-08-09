/**
 * Used by: dashboard, capacity
 * Purpose: Pie chart showing EC2 costs broken down by instance types and usage patterns
 */
"use client"

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { 
    component: "Compute", 
    cost: 315000, 
    fill: "var(--color-compute)",
    details: {
      onDemand: 189000,
      reserved: 95000,
      spot: 31000
    },
    percentage: 70
  },
  { 
    component: "EBS Storage", 
    cost: 95000, 
    fill: "var(--color-ebs)",
    details: {
      gp3: 58000,
      gp2: 25000,
      io1: 12000
    },
    percentage: 21
  },
  { 
    component: "Data Transfer", 
    cost: 40123, 
    fill: "var(--color-data)",
    details: {
      outbound: 28000,
      crossAZ: 8123,
      inbound: 4000
    },
    percentage: 9
  },
]

const chartConfig = {
  cost: { label: "Cost" },
  compute: { label: "Compute", color: "hsl(var(--chart-1))" },
  ebs: { label: "EBS", color: "hsl(var(--chart-2))" },
  data: { label: "Data Transfer", color: "hsl(var(--chart-3))" },
}

export default function Ec2CostBreakdown() {
  const totalCost = chartData.reduce((sum, item) => sum + item.cost, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>EC2 Cost Composition</CardTitle>
        <CardDescription>
          Detailed breakdown of EC2 infrastructure costs and subcategories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="flex flex-col">
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="component" hideLabel />} />
                  <Pie data={chartData} dataKey="cost" nameKey="component" innerRadius={40} strokeWidth={3}>
                    {chartData.map((entry) => (
                      <Cell key={entry.component} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-center">
              <div className="text-lg font-bold">${totalCost.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total EC2 Cost</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Category Details:</div>
            {chartData.map((item) => (
              <div key={item.component} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill.replace('var(--color-', 'hsl(var(--chart-').replace(')', '))') }}
                    />
                    <span className="font-medium text-sm">{item.component}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">${item.cost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
                
                {/* Subcategory Details */}
                <div className="ml-5 space-y-1">
                  {Object.entries(item.details).map(([subcat, amount]) => (
                    <div key={subcat} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">
                        {subcat.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span>${(amount as number).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Quick Insights */}
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground mb-1">Cost Insights:</div>
              <div className="space-y-1 text-xs">
                <div className="text-orange-600">• 60% On-Demand usage - consider Reserved Instances</div>
                <div className="text-green-600">• 61% EBS using GP3 - good cost optimization</div>
                <div className="text-blue-600">• Data transfer costs manageable at 9%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
