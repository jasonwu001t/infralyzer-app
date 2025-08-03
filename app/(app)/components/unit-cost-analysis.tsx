/**
 * Used by: dashboard, capacity, ai-insights
 * Purpose: Analyzes unit costs and efficiency metrics for cost optimization insights
 */
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { month: "Apr", cost: 0.12 },
  { month: "May", cost: 0.11 },
  { month: "Jun", cost: 0.1 },
  { month: "Jul", cost: 0.09 },
  { month: "Aug", cost: 0.09 },
  { month: "Sep", cost: 0.08 },
]

export default function UnitCostAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Cost Analysis</CardTitle>
        <CardDescription>Cost per active user over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="cost" stroke="hsl(var(--chart-1))" name="Cost per User" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
