"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function FinopsMaturityScore() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FinOps Maturity Score</CardTitle>
        <CardDescription>Based on tagging, optimization, and discount coverage.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <p className="text-3xl font-bold">78/100</p>
          <p className="text-sm font-medium">Practitioner</p>
        </div>
        <div className="flex-grow space-y-2">
          <div>
            <div className="flex justify-between text-xs">
              <p>Tagging</p>
              <p>90%</p>
            </div>
            <Progress value={90} />
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <p>Optimization</p>
              <p>65%</p>
            </div>
            <Progress value={65} />
          </div>
          <div>
            <div className="flex justify-between text-xs">
              <p>Discounts</p>
              <p>80%</p>
            </div>
            <Progress value={80} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
