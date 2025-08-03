"use client"

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { type: "Usage", cost: 1150000, fill: "var(--color-usage)" },
  { type: "Tax", cost: 85000, fill: "var(--color-tax)" },
  { type: "Credit", cost: -15000, fill: "var(--color-credit)" },
]

const chartConfig = {
  cost: { label: "Cost" },
  usage: { label: "Usage", color: "hsl(var(--chart-1))" },
  tax: { label: "Tax", color: "hsl(var(--chart-2))" },
  credit: { label: "Credit", color: "hsl(var(--chart-3))" },
}

export default function CostByChargeType() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Charge Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="type" hideLabel />} />
              <Pie data={chartData} dataKey="cost" nameKey="type" innerRadius={40} strokeWidth={5}>
                {chartData.map((entry) => (
                  <Cell key={entry.type} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="type" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
