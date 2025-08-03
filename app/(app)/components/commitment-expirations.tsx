"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const expirationData = [
  { id: "SP-123", type: "Savings Plan", expires: "in 15 days", commitment: "$50/hr" },
  { id: "RI-456", type: "EC2 RI", expires: "in 45 days", commitment: "5x m5.large" },
  { id: "RI-789", type: "RDS RI", expires: "in 88 days", commitment: "2x db.r5.xlarge" },
]

export default function CommitmentExpirations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commitment Expirations</CardTitle>
        <CardDescription>RI/SP expiring in next 90 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Commitment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expirationData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.expires}</TableCell>
                <TableCell>{item.commitment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
