"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { 
  Brain, 
  Gauge,
  MessageCircle,
  Award,
  TrendingUp,
  Sparkles,
  BarChart3,
  Target,
  Shield,
  Zap,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import AIInsightsModal from './ai-insights-modal'

export default function DashboardHeaderTools() {
  const [showAI, setShowAI] = useState(false)
  const [showFinOps, setShowFinOps] = useState(false)

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
    <div className="flex flex-col gap-4 bg-gradient-to-r from-gray-50 to-blue-50 border rounded-lg p-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Side - Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:flex lg:items-center lg:gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex-shrink-0">
            <Gauge className="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium sm:text-sm">FinOps Maturity</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600 sm:text-2xl">{finopsMaturity.overall}</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                Advanced
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex-shrink-0">
            <TrendingUp className="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium sm:text-sm">Monthly Savings</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600 sm:text-2xl">$47.2K</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                +12%
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex-shrink-0">
            <Brain className="h-4 w-4 text-white sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium sm:text-sm">AI Insights</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-purple-600 sm:text-2xl">3</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        {/* AI Assistant Button */}
        <Sheet open={showAI} onOpenChange={setShowAI}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">AI</span>
              <Sparkles className="h-3 w-3 text-blue-500" />
            </Button>
          </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1200px] max-w-[95vw] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Cost Intelligence
              </SheetTitle>
              <SheetDescription>
                Get instant insights and ask questions about your cloud costs
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <AIInsightsModal />
            </div>
          </SheetContent>
        </Sheet>

        {/* FinOps Maturity Button */}
        <Dialog open={showFinOps} onOpenChange={setShowFinOps}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-sm">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">FinOps Assessment</span>
              <span className="sm:hidden">FinOps</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {finopsMaturity.overall}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                FinOps Maturity Assessment
              </DialogTitle>
              <DialogDescription>
                Your organization's cloud financial management maturity across key capabilities
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              {/* Overall Score */}
              <div className="text-center space-y-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-blue-600">{finopsMaturity.overall}</div>
                    <div className="text-sm text-muted-foreground">Overall Maturity Score</div>
                  </div>
                </div>
                <Progress value={finopsMaturity.overall} className="h-4" />
                <div className="flex items-center justify-center gap-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Advanced Level
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +8 points this quarter
                  </Badge>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Category Performance</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                  {finopsMaturity.categories.map((category, index) => {
                    const IconComponent = category.icon
                    return (
                      <Card key={index} className={`${getMaturityBgColor(category.score)} border-2`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-6 w-6" />
                              <span className="font-medium text-lg">{category.name}</span>
                            </div>
                            <span className={`text-3xl font-bold ${getMaturityColor(category.score)}`}>
                              {category.score}
                            </span>
                          </div>
                          <Progress value={category.score} className="h-3 mb-4" />
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className={getMaturityStatus(category.status).color}>
                              {getMaturityStatus(category.status).label}
                            </Badge>
                            {category.score < 80 && (
                              <Button variant="ghost" size="sm">
                                View Recommendations
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Key Insights */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Insights & Recommendations</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Strengths</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Excellent cost visibility (85%)</li>
                      <li>• Strong optimization practices (82%)</li>
                      <li>• High savings achievement ($47.2K/month)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Improvements</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Enhance governance policies</li>
                      <li>• Implement automated cost controls</li>
                      <li>• Establish chargeback mechanisms</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Next Steps</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Set up cost anomaly detection</li>
                      <li>• Define team cost KPIs</li>
                      <li>• Automate RI recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  Download Report
                </Button>
                <Button>
                  Create Improvement Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}