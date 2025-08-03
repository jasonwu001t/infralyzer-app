"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const regionalData = [
  { region: "us-east-1", cost: 550000, percentage: 44 },
  { region: "us-west-2", cost: 320000, percentage: 26 },
  { region: "eu-west-1", cost: 180000, percentage: 14 },
  { region: "ap-southeast-2", cost: 110000, percentage: 9 },
  { region: "Other", cost: 90430, percentage: 7 },
]

export default function RegionalCostBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by Region</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {regionalData.map((item) => (
          <div key={item.region}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.region}</span>
              <span className="text-muted-foreground">${item.cost.toLocaleString()}</span>
            </div>
            <Progress value={item.percentage} className="mt-1 h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
