"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu } from "lucide-react"

export default function ComputeEfficiencyMetric() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Compute Efficiency</CardTitle>
        <Cpu className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$0.035</div>
        <p className="text-xs text-muted-foreground">Average cost per vCPU hour</p>
      </CardContent>
    </Card>
  )
}
