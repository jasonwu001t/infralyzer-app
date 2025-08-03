"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dataTransferData = [
  { from: "us-east-1", to: "us-west-2", cost: 12500 },
  { from: "us-east-1", to: "Internet", cost: 8800 },
  { from: "eu-west-1", to: "us-east-1", cost: 5400 },
]

export default function DataTransferHotspots() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Transfer Hotspots</CardTitle>
        <CardDescription>Top data transfer costs by path.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTransferData.map((item) => (
              <TableRow key={`${item.from}-${item.to}`}>
                <TableCell>{item.from}</TableCell>
                <TableCell>{item.to}</TableCell>
                <TableCell className="text-right">${item.cost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
