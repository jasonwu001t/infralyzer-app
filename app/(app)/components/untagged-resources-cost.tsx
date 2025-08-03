"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "lucide-react"

export default function UntaggedResourcesCost() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Untagged Resources Cost</CardTitle>
        <Tag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$115,234</div>
        <p className="text-xs text-muted-foreground">12% of total spend is untagged</p>
      </CardContent>
    </Card>
  )
}
