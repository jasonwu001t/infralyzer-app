"use client"

import {
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = Array.from({ length: 15 }, (_, i) => ({
  date: `Sep ${i + 1}`,
  current: Math.floor(Math.random() * (90 - 60 + 1) + 60),
  previous: Math.floor(Math.random() * (85 - 55 + 1) + 55),
  forecast: Math.floor(Math.random() * (95 - 65 + 1) + 65),
}))

const chartConfig = {
  current: { label: "Current Spend", color: "hsl(var(--chart-1))" },
  previous: { label: "Previous Period", color: "hsl(var(--chart-2))" },
  forecast: { label: "Forecast", color: "hsl(var(--chart-3))" },
  budget: { label: "Budget", color: "hsl(var(--destructive))" },
}

export default function SpendSummaryChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Month to Date Spend</CardTitle>
        <CardDescription>Daily spend compared to previous period, forecast, and budget.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickFormatter={(value) => `$${value}k`} tickLine={false} axisLine={false} />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
              <Legend />
              <ReferenceLine
                y={85}
                label={{ value: "Budget", position: "insideTopLeft" }}
                stroke="var(--color-budget)"
                strokeDasharray="3 3"
                strokeWidth={2}
              />
              <Bar dataKey="current" fill="var(--color-current)" radius={4} />
              <Line type="monotone" dataKey="previous" stroke="var(--color-previous)" strokeWidth={2} dot={false} />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--color-forecast)"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
