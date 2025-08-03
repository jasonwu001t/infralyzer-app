"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const anomalyData = [
  { id: 1, title: "Unusual spike in S3 Data Transfer costs", severity: "High", date: "2024-09-28" },
  { id: 2, title: "EC2 spend in ap-southeast-2 increased by 40%", severity: "Medium", date: "2024-09-26" },
  { id: 3, title: "RDS idle instance detected", severity: "Low", date: "2024-09-25" },
]

export default function AnomalyFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Cost Anomalies</CardTitle>
        <CardDescription>AI-detected unusual spending.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {anomalyData.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <AlertTriangle
              className={`mt-1 h-5 w-5 flex-shrink-0 ${
                item.severity === "High"
                  ? "text-red-500"
                  : item.severity === "Medium"
                    ? "text-yellow-500"
                    : "text-blue-500"
              }`}
            />
            <div className="flex-grow">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
