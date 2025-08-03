/**
 * Used by: dashboard, ai-insights, optimization
 * Purpose: Shows services with the highest cost growth rates and change indicators
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp } from "lucide-react"

const growthData = [
  { service: "AWS Glue", growth: 125 },
  { service: "Amazon SageMaker", growth: 88 },
  { service: "AWS Fargate", growth: 62 },
]

export default function TopGrowingServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Growing Services</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">MoM Growth</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {growthData.map((item) => (
              <TableRow key={item.service}>
                <TableCell className="font-medium">{item.service}</TableCell>
                <TableCell className="flex items-center justify-end gap-2 text-green-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>{item.growth}%</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
