"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function CloudRoiWidget() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Cloud Cost as % of Revenue</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12.5%</div>
        <p className="text-xs text-muted-foreground">Down from 14.2% last quarter</p>
      </CardContent>
    </Card>
  )
}
