"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function AwsCreditsStatus() {
  const totalCredits = 50000
  const remainingCredits = 12500
  const progress = (remainingCredits / totalCredits) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>AWS Credits</CardTitle>
        <CardDescription>Remaining promotional credits.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Remaining: ${remainingCredits.toLocaleString()}</span>
          <span className="text-muted-foreground">Total: ${totalCredits.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3" />
      </CardContent>
    </Card>
  )
}
