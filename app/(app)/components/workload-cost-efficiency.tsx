"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"

const workloadData = [
  { name: "Data Processing Pipeline", cost: 120000, trend: -5 },
  { name: "Customer API", cost: 85000, trend: 2 },
  { name: "BI Analytics Platform", cost: 65000, trend: -10 },
  { name: "Marketing Website", cost: 15000, trend: 0 },
]

export default function WorkloadCostEfficiency() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workload Cost Efficiency</CardTitle>
        <CardDescription>Cost trends for key business workloads.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workload</TableHead>
              <TableHead>Monthly Cost</TableHead>
              <TableHead className="text-right">MoM Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workloadData.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>${item.cost.toLocaleString()}</TableCell>
                <TableCell
                  className={`flex items-center justify-end gap-1 font-semibold ${
                    item.trend > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {item.trend !== 0 && (item.trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />)}
                  {item.trend}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
