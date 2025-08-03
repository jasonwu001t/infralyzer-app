/**
 * Used by: dashboard, capacity
 * Purpose: Area chart tracking storage growth trends and capacity planning insights
 */
"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "Apr", size: 450 },
  { month: "May", size: 480 },
  { month: "Jun", size: 520 },
  { month: "Jul", size: 550 },
  { month: "Aug", size: 590 },
  { month: "Sep", size: 630 },
]

export default function StorageGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Growth Analysis (S3 + EBS)</CardTitle>
        <CardDescription>Total provisioned storage over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value} TB`} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="size"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-1))"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
