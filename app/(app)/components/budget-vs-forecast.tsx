"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function BudgetVsForecast() {
  const budget = 2400000
  const forecast = 2450800
  const progress = (forecast / budget) * 100
  const overage = forecast - budget

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Forecast</CardTitle>
        <CardDescription>Projected month-end spend.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Forecast: ${forecast.toLocaleString()}</span>
          <span className="text-muted-foreground">Budget: ${budget.toLocaleString()}</span>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="text-center text-sm font-medium text-red-500">
          Projected Overage: ${overage.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
