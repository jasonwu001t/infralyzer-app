"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Gauge,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  Target,
  BarChart3,
  ArrowRight
} from 'lucide-react'

export default function FinOpsMaturityHorizontal() {
  const finopsMaturity = {
    overall: 78,
    categories: [
      { name: 'Cost Visibility', score: 85, status: 'excellent', icon: BarChart3 },
      { name: 'Optimization', score: 82, status: 'good', icon: Target },
      { name: 'Governance', score: 70, status: 'needs_improvement', icon: Shield },
      { name: 'Automation', score: 75, status: 'good', icon: Zap }
    ]
  }

  const getMaturityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMaturityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getMaturityStatus = (status: string) => {
    switch (status) {
      case 'excellent': return { color: 'bg-green-100 text-green-800', label: 'Excellent' }
      case 'good': return { color: 'bg-blue-100 text-blue-800', label: 'Good' }
      case 'needs_improvement': return { color: 'bg-yellow-100 text-yellow-800', label: 'Needs Improvement' }
      default: return { color: 'bg-gray-100 text-gray-800', label: 'Unknown' }
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Gauge className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                FinOps Maturity Assessment
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Q4 2024
                </Badge>
              </CardTitle>
              <CardDescription>
                Your organization's cloud financial management maturity across key capabilities
              </CardDescription>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{finopsMaturity.overall}</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-1">
              Advanced Level
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Maturity Progress</span>
              <span className="text-sm text-muted-foreground">{finopsMaturity.overall}% of Advanced Level</span>
            </div>
            <Progress value={finopsMaturity.overall} className="h-3" />
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {finopsMaturity.categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className={`${getMaturityBgColor(category.score)} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className={`text-lg font-bold ${getMaturityColor(category.score)}`}>
                        {category.score}
                      </span>
                    </div>
                    <Progress value={category.score} className="h-2 mb-2" />
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={getMaturityStatus(category.status).color}>
                        {getMaturityStatus(category.status).label}
                      </Badge>
                      {category.score < 80 && (
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Improve
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>2 categories excellent</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>+8 points this quarter</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>1 area needs attention</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View Report
              </Button>
              <Button size="sm">
                Improvement Plan
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}