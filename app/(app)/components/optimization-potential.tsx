"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const optimizationData = [
  { category: "Idle Resources", potential: 45200, opportunities: 15 },
  { category: "Rightsizing", potential: 28500, opportunities: 42 },
  { category: "Savings Plans", potential: 12300, opportunities: 5 },
  { category: "Storage Tiering", potential: 8700, opportunities: 112 },
]

export default function OptimizationPotential() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimization Potential</CardTitle>
        <CardDescription>Total potential savings: $94,700</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Opportunities</TableHead>
              <TableHead className="text-right">Potential Savings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {optimizationData.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>{item.opportunities}</TableCell>
                <TableCell className="text-right">${item.potential.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
