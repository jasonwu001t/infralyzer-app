"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const accountData = [
  { name: "Prod-West-1 (1111...)", cost: 510234 },
  { name: "Data-Lake-Main (2222...)", cost: 320456 },
  { name: "Shared-Services (3333...)", cost: 180987 },
  { name: "Dev-Sandbox (4444...)", cost: 75123 },
]

export default function TopAccountsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 4 Accounts by Spend</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountData.map((account) => (
              <TableRow key={account.name}>
                <TableCell className="font-medium text-sm">{account.name}</TableCell>
                <TableCell className="text-right">${account.cost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
