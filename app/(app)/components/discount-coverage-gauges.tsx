"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"

const riData = [{ name: "ri", value: 92, fill: "var(--color-ri)" }]
const spData = [{ name: "sp", value: 78, fill: "var(--color-sp)" }]

const chartConfig = {
  value: { label: "Value" },
  ri: { label: "RI Utilization", color: "hsl(var(--chart-1))" },
  sp: { label: "SP Coverage", color: "hsl(var(--chart-2))" },
}

export default function DiscountCoverageGauges() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Coverage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <ResponsiveContainer>
                <RadialBarChart data={riData} startAngle={-270} endAngle={90} innerRadius={60} barSize={20}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm font-medium">RI Utilization: 92%</p>
          </div>
          <div className="flex flex-col items-center">
            <ChartContainer config={chartConfig} className="h-[120px] w-full">
              <ResponsiveContainer>
                <RadialBarChart data={spData} startAngle={-270} endAngle={90} innerRadius={60} barSize={20}>
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-sm font-medium">SP Coverage: 78%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
