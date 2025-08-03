"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgePercent } from "lucide-react"

export default function SpotSavingsWidget() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Spot Savings</CardTitle>
        <BadgePercent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$125,430</div>
        <p className="text-xs text-muted-foreground">Saved this month vs. On-Demand</p>
      </CardContent>
    </Card>
  )
}
