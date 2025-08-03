"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ebsData = [
  { metric: "Total Volumes", value: "1,234" },
  { metric: "Unattached Volumes", value: "88" },
  { metric: "Potential Savings", value: "$4,520/mo" },
]

export default function EbsVolumeAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>EBS Volume Analysis</CardTitle>
        <CardDescription>Snapshot of EBS storage costs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ebsData.map((item) => (
              <TableRow key={item.metric}>
                <TableCell className="font-medium">{item.metric}</TableCell>
                <TableCell className="text-right">{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
