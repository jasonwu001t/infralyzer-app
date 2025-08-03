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
  { component: "Compute", cost: 315000, fill: "var(--color-compute)" },
  { component: "EBS", cost: 95000, fill: "var(--color-ebs)" },
  { component: "Data Transfer", cost: 40123, fill: "var(--color-data)" },
]

const chartConfig = {
  cost: { label: "Cost" },
  compute: { label: "Compute", color: "hsl(var(--chart-1))" },
  ebs: { label: "EBS", color: "hsl(var(--chart-2))" },
  data: { label: "Data Transfer", color: "hsl(var(--chart-3))" },
}

export default function Ec2CostBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EC2 Cost Composition</CardTitle>
        <CardDescription>Breakdown of EC2 costs.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="component" hideLabel />} />
              <Pie data={chartData} dataKey="cost" nameKey="component" innerRadius={50} strokeWidth={5}>
                {chartData.map((entry) => (
                  <Cell key={entry.component} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="component" wrapperStyle={{ fontSize: "12px" }} />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
