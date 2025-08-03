"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Activity,
  Send,
  MessageCircle,
  Sparkles,
  User,
  Bot
} from 'lucide-react'

interface AIInsight {
  type: 'positive' | 'warning' | 'opportunity' | 'alert'
  title: string
  description: string
  metric?: string
  impact?: string
  action?: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  message: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIInsightsModal() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: "Hi! I'm your AI cost analyst. I've analyzed your cloud spending and found some key insights. Ask me anything about your costs, optimization opportunities, or specific services!",
      timestamp: new Date(),
      suggestions: [
        "Why did Lambda costs spike?",
        "What can I optimize today?",
        "Show me my biggest savings opportunity",
        "How is my RI utilization?"
      ]
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

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

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = {
        'lambda': {
          message: "The Lambda cost spike is due to a new microservice deployment on Dec 15th. The 'user-analytics' function is processing 300% more events. I recommend implementing batching to reduce invocations by ~60% and save $1,900/month.",
          suggestions: ["How to implement batching?", "Show Lambda optimization guide", "Compare with other functions"]
        },
        'optimize': {
          message: "Here are your top 3 immediate optimizations: 1) Rightsize 12 EC2 instances (save $2,340/month), 2) Purchase RIs for stable workloads (save $4,200/month), 3) Move S3 data to IA/Glacier (save $890/month). Total potential: $7,430/month.",
          suggestions: ["Start with EC2 rightsizing", "Show RI recommendations", "Implement S3 lifecycle rules"]
        },
        'savings': {
          message: "Your biggest opportunity is Reserved Instance coverage. You have 67% RI coverage but could reach 85% on stable workloads. This would save $4,200/month with minimal risk. I can help you identify the exact instances to cover.",
          suggestions: ["Show RI recommendations", "Calculate ROI", "Compare RI vs Savings Plans"]
        },
        'ri': {
          message: "Your RI utilization is excellent at 89%! You're effectively using your committed capacity. However, I notice you could increase coverage from 67% to 85% on your stable m5.large and c5.xlarge instances in us-east-1.",
          suggestions: ["Show detailed RI report", "Recommend new RIs", "Monitor utilization trends"]
        }
      }

      const messageKey = Object.keys(aiResponses).find(key => 
        userMessage.message.toLowerCase().includes(key)
      )
      
      const response = messageKey ? aiResponses[messageKey as keyof typeof aiResponses] : {
        message: "I can help you analyze specific cost areas! Try asking about Lambda costs, optimization opportunities, RI utilization, or any specific AWS service. I have detailed insights on your entire cloud spending.",
        suggestions: ["Analyze EC2 costs", "Check S3 spending", "Review data transfer costs", "Optimize database spend"]
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: response.message,
        timestamp: new Date(),
        suggestions: response.suggestions
      }

      setChatMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
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

  return (
    <div className="space-y-6 p-2">
      {/* Key Metrics Overview */}
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

      {/* Interactive AI Chat - Main Feature */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            AI Cost Assistant
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
          <CardDescription>
            Ask questions about your cloud costs, get optimization recommendations, and explore specific services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <ScrollArea className="h-80 border rounded-lg p-4 mb-4 bg-white">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] space-y-2`}>
                    <div className={`flex items-center gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {msg.type === 'user' ? 
                          <User className="h-4 w-4 text-white" /> : 
                          <Bot className="h-4 w-4 text-white" />
                        }
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-500 text-white ml-8' 
                        : 'bg-gray-100 text-gray-900 mr-8'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    {msg.suggestions && (
                      <div className="mr-8 space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-white hover:bg-blue-50"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[75%]">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-purple-500">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs text-muted-foreground">AI is analyzing...</span>
                    </div>
                    <div className="bg-gray-100 text-gray-900 mr-8 p-4 rounded-lg mt-2">
                      <div className="flex space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="flex gap-3">
            <Input
              placeholder="Ask about Lambda costs, optimization opportunities, RI recommendations..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 h-12"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentMessage.trim() || isTyping}
              className="h-12 px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Latest AI Insights
          </CardTitle>
          <CardDescription>
            Automatically detected cost patterns and optimization opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <span className="font-medium">{insight.title}</span>
                  </div>
                  <Badge variant="secondary" className={getInsightBadgeColor(insight.type)}>
                    {insight.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    {insight.metric && (
                      <span className="font-medium text-blue-600">{insight.metric}</span>
                    )}
                    {insight.impact && (
                      <span className="text-green-600 font-medium">{insight.impact}</span>
                    )}
                  </div>
                  {insight.action && (
                    <Button variant="outline" size="sm" className="h-8">
                      {insight.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Immediate Improvement Opportunities
          </CardTitle>
          <CardDescription>
            AI-recommended actions you can take right now to improve your cloud cost efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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