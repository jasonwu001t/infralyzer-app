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
  { option: "On-Demand", cost: 450000, fill: "var(--color-od)" },
  { option: "Savings Plan", cost: 550000, fill: "var(--color-sp)" },
  { option: "Reserved", cost: 200000, fill: "var(--color-ri)" },
  { option: "Spot", cost: 50000, fill: "var(--color-spot)" },
]

const chartConfig = {
  cost: { label: "Cost" },
  od: { label: "On-Demand", color: "hsl(var(--chart-1))" },
  sp: { label: "Savings Plan", color: "hsl(var(--chart-2))" },
  ri: { label: "Reserved", color: "hsl(var(--chart-3))" },
  spot: { label: "Spot", color: "hsl(var(--chart-4))" },
}

export default function CostByPurchaseOption() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Purchase Option</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="option" hideLabel />} />
              <Pie data={chartData} dataKey="cost" nameKey="option" innerRadius={50} strokeWidth={5}>
                {chartData.map((entry) => (
                  <Cell key={entry.option} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="option" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
