"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Zap,
  Shield,
  DollarSign,
  Award,
  ArrowRight,
  Lightbulb,
  Gauge,
  Activity
} from 'lucide-react'

interface AIInsight {
  type: 'positive' | 'warning' | 'opportunity' | 'alert'
  title: string
  description: string
  metric?: string
  impact?: string
  action?: string
}

export default function AIInsightsSummary() {
  // Demo AI-generated insights
  const insights: AIInsight[] = [
    {
      type: 'positive',
      title: 'Excellent Cost Optimization',
      description: 'Your EC2 costs have decreased by 18% this month due to effective RI utilization and rightsizing.',
      metric: '-18% EC2 costs',
      impact: '$12,450 monthly savings',
      action: 'Continue current optimization strategy'
    },
    {
      type: 'warning', 
      title: 'Lambda Cost Spike Detected',
      description: 'Lambda invocations increased 145% in the last 7 days, possibly due to new deployment.',
      metric: '+145% Lambda usage',
      impact: '+$3,200 unexpected cost',
      action: 'Review Lambda function efficiency'
    },
    {
      type: 'opportunity',
      title: 'S3 Storage Optimization',
      description: 'Detected 2.3TB of data that could be moved to cheaper storage classes.',
      metric: '2.3TB optimization potential',
      impact: '$890 monthly savings',
      action: 'Implement lifecycle policies'
    }
  ]

  const finopsMaturity = {
    overall: 78,
    categories: [
      { name: 'Cost Visibility', score: 85, status: 'excellent' },
      { name: 'Optimization', score: 82, status: 'good' },
      { name: 'Governance', score: 70, status: 'needs_improvement' },
      { name: 'Automation', score: 75, status: 'good' }
    ]
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-blue-500" />
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getInsightBadgeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'  
      case 'opportunity': return 'bg-blue-100 text-blue-800'
      case 'alert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMaturityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
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
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">AI-Powered Insights</h2>
            <p className="text-muted-foreground">
              Real-time analysis of your cloud cost performance and optimization opportunities
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Last updated: 2 minutes ago
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Performance Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Performance Summary
            </CardTitle>
            <CardDescription>
              AI analysis of your cost and usage trends over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border">
                  <div className="text-xl font-bold text-green-600">$47.2K</div>
                  <div className="text-sm text-green-800">Monthly Savings</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+12% vs last month</span>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg border">
                  <div className="text-xl font-bold text-blue-600">89%</div>
                  <div className="text-sm text-blue-800">RI Utilization</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600">+5% improvement</span>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg border">
                  <div className="text-xl font-bold text-purple-600">23%</div>
                  <div className="text-sm text-purple-800">Cost Optimization</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Target className="h-3 w-3 text-purple-500" />
                    <span className="text-xs text-purple-600">vs list price</span>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg border">
                  <div className="text-xl font-bold text-orange-600">94%</div>
                  <div className="text-sm text-orange-800">Cost Visibility</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">Resources tagged</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-3">
                <h4 className="font-medium">AI-Detected Insights</h4>
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium">{insight.title}</span>
                      </div>
                      <Badge variant="secondary" className={getInsightBadgeColor(insight.type)}>
                        {insight.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {insight.metric && (
                          <span className="font-medium">{insight.metric}</span>
                        )}
                        {insight.impact && (
                          <span className="text-green-600">{insight.impact}</span>
                        )}
                      </div>
                      {insight.action && (
                        <Button variant="outline" size="sm">
                          {insight.action}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FinOps Maturity Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              FinOps Maturity Score
            </CardTitle>
            <CardDescription>
              Your organization's cloud financial management maturity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-blue-600">{finopsMaturity.overall}</div>
                <div className="text-sm text-muted-foreground">Overall Maturity Score</div>
                <Progress value={finopsMaturity.overall} className="h-3" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Advanced Level
                </Badge>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium">Category Breakdown</h4>
                {finopsMaturity.categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${getMaturityColor(category.score)}`}>
                          {category.score}
                        </span>
                        <Badge variant="secondary" className={getMaturityStatus(category.status).color}>
                          {getMaturityStatus(category.status).label}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={category.score} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Improvement Actions */}
              <div className="space-y-3">
                <h4 className="font-medium">Recommended Actions</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm p-2 bg-yellow-50 rounded border-l-2 border-yellow-500">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Implement automated cost anomaly detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Establish chargeback policies for teams</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-2 bg-green-50 rounded border-l-2 border-green-500">
                    <Award className="h-4 w-4 text-green-600" />
                    <span>Set up cost optimization KPIs</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Immediate Improvement Opportunities
          </CardTitle>
          <CardDescription>
            AI-recommended actions you can take right now to improve your cloud cost efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium">Rightsize Resources</span>
              </div>
              <p className="text-sm text-muted-foreground">
                15 EC2 instances are oversized and could save $2,340/month
              </p>
              <Button size="sm" className="w-full">
                View Recommendations
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Purchase RIs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Buy Reserved Instances for stable workloads to save $8,200/month
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Analyze Coverage
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Storage Optimization</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Move old data to Glacier to save $1,850/month
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Set Lifecycle Rules
              </Button>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Tag Resources</span>
              </div>
              <p className="text-sm text-muted-foreground">
                6% of resources are untagged. Improve cost allocation visibility.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Auto-Tag Resources
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}