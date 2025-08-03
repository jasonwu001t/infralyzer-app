"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { tag: "Project: Phoenix", cost: 186000 },
  { tag: "Project: Cerberus", cost: 124000 },
  { tag: "CostCenter: 123-A", cost: 98000 },
  { tag: "Team: Platform", cost: 76000 },
  { tag: "Env: Prod", cost: 215000 },
].sort((a, b) => a.cost - b.cost)

const chartConfig = {
  cost: { label: "Cost", color: "hsl(var(--chart-1))" },
}

export default function TopCostByTag() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Cost by Tag</CardTitle>
        <CardDescription>Grouped by 'Project' tag.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="tag" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="cost" layout="vertical" fill="var(--color-cost)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
