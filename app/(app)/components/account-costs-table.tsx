"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer } from "recharts"

const accountData = [
  { name: "Prod-West-1 (1111...)", cost: 510234, trend: [6, 7, 8, 7, 8, 9, 10] },
  { name: "Data-Lake-Main (2222...)", cost: 320456, trend: [5, 5, 6, 6, 7, 7, 8] },
  { name: "Shared-Services (3333...)", cost: 180987, trend: [4, 4, 4, 5, 5, 6, 6] },
  { name: "Dev-Sandbox (4444...)", cost: 75123, trend: [2, 3, 3, 2, 3, 4, 4] },
  { name: "Marketing-Site (5555...)", cost: 45670, trend: [1, 1, 2, 2, 2, 3, 3] },
]

export default function AccountCostsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">7-Day Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountData.map((account) => (
              <TableRow key={account.name}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>${account.cost.toLocaleString()}</TableCell>
                <TableCell>
                  <ChartContainer config={{}} className="h-[40px] w-[150px] ml-auto">
                    <ResponsiveContainer>
                      <LineChart data={account.trend.map((v) => ({ value: v }))}>
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
