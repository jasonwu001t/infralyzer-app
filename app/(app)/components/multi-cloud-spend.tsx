"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud } from "lucide-react"

export default function MultiCloudSpend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Cloud Spend</CardTitle>
        <CardDescription>Placeholder for multi-cloud data.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-[200px]">
        <Cloud className="h-12 w-12 mb-4" />
        <p>Connect GCP and Azure accounts to enable multi-cloud analysis.</p>
      </CardContent>
    </Card>
  )
}
