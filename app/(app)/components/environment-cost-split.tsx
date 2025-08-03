"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { env: "Production", cost: 950000 },
  { env: "Staging", cost: 150000 },
  { env: "Development", cost: 120000 },
  { env: "Sandbox", cost: 30000 },
]

export default function EnvironmentCostSplit() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Cost Split</CardTitle>
        <CardDescription>Cost breakdown by environment tag.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[250px] w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
              <YAxis dataKey="env" type="category" width={80} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
