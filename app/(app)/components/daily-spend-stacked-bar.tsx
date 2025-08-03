"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = Array.from({ length: 15 }, (_, i) => ({
  date: `Sep ${i + 1}`,
  ec2: Math.floor(Math.random() * 30) + 20,
  s3: Math.floor(Math.random() * 20) + 10,
  rds: Math.floor(Math.random() * 15) + 5,
  other: Math.floor(Math.random() * 10) + 5,
}))

const chartConfig = {
  ec2: { label: "EC2", color: "hsl(var(--chart-1))" },
  s3: { label: "S3", color: "hsl(var(--chart-2))" },
  rds: { label: "RDS", color: "hsl(var(--chart-3))" },
  other: { label: "Other", color: "hsl(var(--chart-4))" },
}

export default function DailySpendStackedBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Spend by Service</CardTitle>
        <CardDescription>Composition of daily costs.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
              <YAxis tickFormatter={(value) => `$${value}k`} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="ec2" stackId="a" fill="var(--color-ec2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="s3" stackId="a" fill="var(--color-s3)" />
              <Bar dataKey="rds" stackId="a" fill="var(--color-rds)" />
              <Bar dataKey="other" stackId="a" fill="var(--color-other)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
