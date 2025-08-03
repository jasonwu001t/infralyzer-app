"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, CalendarDays, LucideIcon } from "lucide-react"

// Icon mapping for React 19 compatibility
const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CalendarDays,
}

interface KpiCardProps {
  title: string
  value: string
  trend: string
  icon: string // Changed from Icon: LucideIcon to icon: string
}

export default function KpiCard({ title, value, trend, icon }: KpiCardProps) {
  const isPositive = trend.startsWith("+")
  const isNegative = trend.startsWith("-")
  
  // Get the icon component from the map
  const IconComponent = iconMap[icon] || DollarSign

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"}`}
        >
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}
