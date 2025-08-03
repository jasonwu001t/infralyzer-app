"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer } from "recharts"

const serviceData = [
  { name: "Amazon EC2", cost: 450123, trend: [5, 6, 5, 7, 8, 9, 10] },
  { name: "Amazon S3", cost: 210987, trend: [4, 4, 5, 5, 6, 6, 7] },
  { name: "Amazon RDS", cost: 150456, trend: [3, 3, 3, 4, 4, 5, 5] },
  { name: "AWS Lambda", cost: 95123, trend: [2, 3, 3, 3, 2, 3, 4] },
  { name: "AWS Data Transfer", cost: 85670, trend: [1, 2, 2, 3, 3, 3, 3] },
]

export default function ServiceCostsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Service</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">7-Day Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {serviceData.map((service) => (
              <TableRow key={service.name}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>${service.cost.toLocaleString()}</TableCell>
                <TableCell>
                  <ChartContainer config={{}} className="h-[40px] w-[150px] ml-auto">
                    <ResponsiveContainer>
                      <LineChart data={service.trend.map((v) => ({ value: v }))}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
