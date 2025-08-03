"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AnomalyImpactWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Cost Impact</CardTitle>
        <CardDescription>Estimated cost of anomalies this month.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <div>
          <p className="text-2xl font-bold">$55,280</p>
          <p className="text-xs text-muted-foreground">Across 12 detected anomalies</p>
        </div>
      </CardContent>
    </Card>
  )
}
