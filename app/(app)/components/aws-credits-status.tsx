"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Gift, Calendar, TrendingDown, AlertCircle } from "lucide-react"

interface CreditProgram {
  id: string
  name: string
  type: 'promotional' | 'startup' | 'enterprise' | 'support'
  remaining: number
  total: number
  expiryDate: string
  monthlyBurn: number
  daysUntilExpiry: number
}

export default function AwsCreditsStatus() {
  // Mock data - in real app this would come from API
  const creditPrograms: CreditProgram[] = [
    {
      id: 'promo-1',
      name: 'Startup Credits',
      type: 'startup',
      remaining: 12500,
      total: 50000,
      expiryDate: '2024-12-31',
      monthlyBurn: 3200,
      daysUntilExpiry: 95
    },
    {
      id: 'promo-2', 
      name: 'AWS Activate',
      type: 'promotional',
      remaining: 2800,
      total: 5000,
      expiryDate: '2024-08-15',
      monthlyBurn: 890,
      daysUntilExpiry: 45
    },
    {
      id: 'support-1',
      name: 'Support Credits',
      type: 'support',
      remaining: 1500,
      total: 2000,
      expiryDate: '2024-06-30',
      monthlyBurn: 150,
      daysUntilExpiry: 15
    }
  ]

  const totalRemaining = creditPrograms.reduce((sum, program) => sum + program.remaining, 0)
  const totalOriginal = creditPrograms.reduce((sum, program) => sum + program.total, 0)
  const totalMonthlyBurn = creditPrograms.reduce((sum, program) => sum + program.monthlyBurn, 0)
  const overallProgress = (totalRemaining / totalOriginal) * 100
  const daysToDepletion = Math.round(totalRemaining / (totalMonthlyBurn / 30))

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'startup': return 'bg-blue-100 text-blue-700'
      case 'promotional': return 'bg-green-100 text-green-700'
      case 'enterprise': return 'bg-purple-100 text-purple-700'
      case 'support': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 30) return 'text-red-600'
    if (days <= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-600" />
            <span>AWS Credits Management</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {creditPrograms.length} Programs
          </Badge>
        </CardTitle>
        <CardDescription>
          Active credit programs and burn rate analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xl font-bold text-green-600">
              ${totalRemaining.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Remaining</div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-xs text-muted-foreground">Credits Used</div>
          </div>
        </div>

        {/* Burn Rate & Depletion */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Burn Rate Analysis</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monthly Burn:</span>
              <span className="font-medium">${totalMonthlyBurn.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Depletion:</span>
              <span className={`font-medium ${getUrgencyColor(daysToDepletion)}`}>
                {daysToDepletion} days
              </span>
            </div>
          </div>
        </div>

        {/* Credit Programs */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Active Programs:</div>
          {creditPrograms.map((program) => {
            const programProgress = (program.remaining / program.total) * 100
            const isUrgent = program.daysUntilExpiry <= 30
            
            return (
              <div key={program.id} className="space-y-2 p-2 border rounded">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{program.name}</span>
                    <Badge 
                      className={`text-xs px-1 py-0 ${getTypeColor(program.type)}`}
                    >
                      {program.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-right">
                    <div className="font-medium">${program.remaining.toLocaleString()}</div>
                    <div className="text-muted-foreground">of ${program.total.toLocaleString()}</div>
                  </div>
                </div>
                
                <Progress value={programProgress} className="h-1.5" />
                
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className={getUrgencyColor(program.daysUntilExpiry)}>
                      {program.daysUntilExpiry} days left
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    ${program.monthlyBurn}/mo burn
                  </span>
                </div>
                
                {isUrgent && (
                  <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 p-1 rounded">
                    <AlertCircle className="h-3 w-3" />
                    <span>Expiring soon - prioritize usage</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Optimization Tips */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">Optimization Strategy:</div>
          <div className="space-y-1 text-xs">
            {daysToDepletion < 60 && (
              <div className="text-orange-600">• Accelerate development to utilize credits before expiry</div>
            )}
            {creditPrograms.some(p => p.daysUntilExpiry <= 30) && (
              <div className="text-red-600">• Focus on credits expiring in next 30 days</div>
            )}
            <div className="text-blue-600">• Consider Reserved Instances to maximize credit value</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
