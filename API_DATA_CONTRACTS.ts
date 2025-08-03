// API Data Contracts for Infralyzer Backend Implementation
// This file defines the exact TypeScript interfaces your backend APIs should implement

// ====================================
// Authentication & User Management
// ====================================

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user: User
  token: string
  expiresAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'analyst' | 'viewer'
  organization: string
  avatar?: string
  preferences: UserPreferences
  createdAt: string
  lastLoginAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  defaultTimeRange: '7d' | '30d' | '90d' | '1y'
  defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY'
  defaultRegion: string
  dashboardLayout: string[]
  notifications: NotificationSettings
  language: 'en' | 'es' | 'fr' | 'de'
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  budgetAlerts: boolean
  anomalyAlerts: boolean
  weeklyReports: boolean
  costOptimizationTips: boolean
}

// ====================================
// Dashboard Filter System
// ====================================

export interface DashboardFilters {
  dateRange: {
    start: string  // ISO date string
    end: string    // ISO date string
  }
  granularity: 'daily' | 'weekly' | 'monthly'
  costType: 'blended' | 'unblended' | 'amortized'
  accounts: string[]
  services: string[]
  regions: string[]
  tags: Record<string, string[]>
  costThreshold: {
    min?: number
    max?: number
  }
  comparisonMode: boolean
  comparisonPeriod: {
    primary: 'last-month' | 'previous-month' | 'custom'
    secondary: 'last-month' | 'previous-month' | 'custom'
  }
}

// ====================================
// Dashboard API Responses
// ====================================

export interface KpiResponse {
  success: boolean
  data: {
    mtdSpend: {
      value: number
      trend: string        // e.g., "+2.5% vs last period"
      currency: string     // e.g., "USD"
    }
    forecast: {
      value: number
      trend: string
      confidence: number   // 0-1
    }
    savings: {
      value: number
      opportunities: number
    }
    budgetUtilization: {
      percentage: number
      status: 'on-track' | 'warning' | 'over-budget'
    }
  }
  meta: {
    executionTime: number
    lastUpdated: string
  }
}

export interface SpendSummaryResponse {
  success: boolean
  data: Array<{
    date: string         // ISO date
    current: number
    previous: number
    forecast: number
    budget?: number
  }>
  meta: {
    granularity: 'daily' | 'weekly' | 'monthly'
    currency: string
  }
}

export interface ServiceCostsResponse {
  success: boolean
  data: {
    services: Array<{
      serviceId: string
      serviceName: string
      displayName: string
      category: string
      cost: {
        current: number
        previous: number
        changePercent: number
      }
      trend: {
        direction: 'up' | 'down' | 'stable'
        data: number[]
      }
      usage: {
        amount: number
        unit: string
      }
      region?: string
    }>
    totalCost: number
    pagination: {
      page: number
      totalPages: number
      totalCount: number
    }
  }
}

export interface AccountCostsResponse {
  success: boolean
  data: {
    accounts: Array<{
      accountId: string
      accountName: string
      cost: number
      trend: number[]
      region: string
    }>
  }
}

export interface AnomalyResponse {
  success: boolean
  data: {
    anomalies: Array<{
      id: string
      title: string
      description: string
      severity: 'High' | 'Medium' | 'Low'
      date: string
      service?: string
      region?: string
      impact: number
      status: 'new' | 'investigating' | 'resolved'
      recommendations?: string[]
    }>
  }
}

// ====================================
// Cost Analytics API Responses
// ====================================

export interface CostBreakdownRequest {
  startDate: string
  endDate: string
  granularity: 'daily' | 'weekly' | 'monthly'
  groupBy: 'service' | 'account' | 'region' | 'tag'
  costTypes: ('list' | 'billed' | 'contracted' | 'effective')[]
  filters: DashboardFilters
}

export interface CostBreakdownResponse {
  success: boolean
  data: {
    breakdown: Array<{
      dimension: string
      costs: {
        list: number
        billed: number
        contracted: number
        effective: number
      }
      rates: {
        discount: number
        commitment: number
      }
      trend: number[]
    }>
  }
}

export interface PurchaseOptionResponse {
  success: boolean
  data: Array<{
    type: 'On-Demand' | 'Reserved' | 'Spot' | 'Savings Plan'
    cost: number
    percentage: number
    savings: number
  }>
}

export interface DiscountAnalysisResponse {
  success: boolean
  data: {
    riCoverage: {
      percentage: number
      utilization: number
      expiringSoon: number
    }
    savingsPlans: {
      coverage: number
      utilization: number
      commitment: number
    }
    spotUsage: {
      percentage: number
      savings: number
      interruptions: number
    }
  }
}

// ====================================
// SQL Lab API Contracts
// ====================================

export interface QueryExecuteRequest {
  userId: string
  query: string
  parameters?: Record<string, any>
}

export interface QueryExecuteResponse {
  success: boolean
  data?: {
    queryId: string
    results: {
      headers: string[]
      rows: (string | number | null)[][]
      rowCount: number
      executionTime: number
    }
  }
  error?: string
}

export interface SavedQuery {
  id: string
  userId: string
  name: string
  description?: string
  query: string
  tags: string[]
  isPublic: boolean
  createdAt: string
  lastExecuted?: string
  executionCount: number
}

export interface QueryTemplate {
  id: string
  name: string
  category: string
  description: string
  query: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface QueryHistory {
  id: string
  userId: string
  query: string
  status: 'success' | 'error' | 'running'
  executedAt: string
  duration?: number
  resultRows?: number
  errorMessage?: string
}

export interface AIGenerateRequest {
  prompt: string
  context: 'cost-analysis' | 'optimization' | 'governance'
  schema?: string[]
}

export interface AIGenerateResponse {
  success: boolean
  data?: {
    query: string
    explanation: string
    confidence: number
  }
  error?: string
}

// ====================================
// Optimization API Contracts
// ====================================

export interface OptimizationResponse {
  success: boolean
  data: {
    recommendations: Array<{
      id: string
      category: 'rightsizing' | 'unused-resources' | 'commitments' | 'storage'
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
      potential: {
        monthlySavings: number
        annualSavings: number
        effort: 'low' | 'medium' | 'high'
      }
      resources: Array<{
        id: string
        type: string
        currentCost: number
        recommendedAction: string
      }>
      implementation: {
        steps: string[]
        estimatedTime: string
        risks: string[]
      }
    }>
  }
}

export interface OptimizationPotentialResponse {
  success: boolean
  data: {
    categories: Array<{
      category: string
      potential: number
      opportunities: number
      priority: 'High' | 'Medium' | 'Low'
      services: string[]
    }>
    totalPotential: number
  }
}

// ====================================
// AWS Pricing API Contracts (Already Implemented)
// ====================================

export interface PriceInfo {
  hourly_price: number
  monthly_price: number
  savings_vs_ondemand_pct: number
}

export interface InstancePricing {
  instance_type: string
  metadata: {
    vcpu: string
    memory: string
    storage: string
    network_performance: string
    instance_family?: string
  }
  pricing: {
    ondemand: PriceInfo
    spot: PriceInfo
    reserved_1yr: PriceInfo
    savings_plan: PriceInfo
  }
}

export interface PricingResponse {
  success: boolean
  data: InstancePricing[]
  region: string
  operating_system: string
  timestamp: string
}

// ====================================
// AI Insights API Contracts
// ====================================

export interface AIInsightsResponse {
  success: boolean
  data: {
    insights: Array<{
      id: string
      type: 'cost-spike' | 'optimization' | 'trend' | 'anomaly'
      title: string
      description: string
      impact: 'high' | 'medium' | 'low'
      confidence: number
      data: any
      recommendations: string[]
      createdAt: string
    }>
  }
}

export interface ChatRequest {
  userId: string
  message: string
  conversationId?: string
  context?: any
}

export interface ChatResponse {
  success: boolean
  data: {
    response: string
    insights?: string[]
    recommendations?: string[]
    conversationId: string
  }
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  metadata?: {
    query?: string
    insights?: string[]
    recommendations?: string[]
  }
}

export interface ChatConversation {
  id: string
  userId: string
  messages: ChatMessage[]
  title: string
  createdAt: string
  lastUpdated: string
}

// ====================================
// Capacity Management API Contracts
// ====================================

export interface CapacityOverviewResponse {
  success: boolean
  data: {
    compute: {
      utilization: number
      efficiency: number
      recommendations: string[]
    }
    storage: {
      growth: number[]
      efficiency: number
      optimization: string[]
    }
    network: {
      transfer: number
      hotspots: Array<{
        source: string
        destination: string
        cost: number
      }>
    }
  }
}

export interface AllocationResponse {
  success: boolean
  data: {
    allocations: Array<{
      dimension: string
      allocated: number
      unallocated: number
      rules: string[]
    }>
  }
}

// ====================================
// Standard API Response Wrapper
// ====================================

export interface StandardAPIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    pagination?: {
      page: number
      totalPages: number
      totalCount: number
    }
    filters?: DashboardFilters
    executionTime?: number
    lastUpdated?: string
    cacheHit?: boolean
  }
}

// ====================================
// Error Response Format
// ====================================

export interface APIError {
  success: false
  error: string
  code?: string
  details?: any
  timestamp: string
}

// ====================================
// Request Headers
// ====================================

export interface APIRequestHeaders {
  'Authorization': string    // Bearer <token>
  'Content-Type': string     // application/json
  'X-User-Role'?: string     // admin | analyst | viewer
  'X-Organization-ID'?: string
}

// ====================================
// Utility Types for API Implementation
// ====================================

export type UserRole = 'admin' | 'analyst' | 'viewer'

export type CostType = 'blended' | 'unblended' | 'amortized'

export type Granularity = 'daily' | 'weekly' | 'monthly'

export type SeverityLevel = 'High' | 'Medium' | 'Low'

export type PriorityLevel = 'high' | 'medium' | 'low'

export type OptimizationCategory = 'rightsizing' | 'unused-resources' | 'commitments' | 'storage'

export type InsightType = 'cost-spike' | 'optimization' | 'trend' | 'anomaly'

// ====================================
// API Endpoint Mapping
// ====================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',
  AUTH_REFRESH: '/api/auth/refresh',

  // User Management
  USER_PROFILE: '/api/users/profile',
  USER_PREFERENCES: '/api/users/preferences',

  // Dashboard
  DASHBOARD_KPIS: '/api/dashboard/kpis',
  DASHBOARD_SPEND_SUMMARY: '/api/dashboard/spend-summary',
  DASHBOARD_SERVICE_COSTS: '/api/dashboard/service-costs',
  DASHBOARD_ACCOUNT_COSTS: '/api/dashboard/account-costs',
  DASHBOARD_ANOMALIES: '/api/dashboard/anomalies',
  DASHBOARD_BUDGET_FORECAST: '/api/dashboard/budget-forecast',
  DASHBOARD_COST_BY_CHARGE_TYPE: '/api/dashboard/cost-by-charge-type',
  DASHBOARD_DISCOUNT_COVERAGE: '/api/dashboard/discount-coverage',
  DASHBOARD_TOP_COST_BY_TAG: '/api/dashboard/top-cost-by-tag',
  DASHBOARD_COMMITMENT_EXPIRATIONS: '/api/dashboard/commitment-expirations',
  DASHBOARD_FORECAST_ACCURACY: '/api/dashboard/forecast-accuracy',

  // Cost Analytics
  COST_ANALYTICS_BREAKDOWN: '/api/cost-analytics/breakdown',
  COST_ANALYTICS_PURCHASE_OPTIONS: '/api/cost-analytics/purchase-options',
  COST_ANALYTICS_DISCOUNTS: '/api/cost-analytics/discounts',

  // SQL Lab
  SQL_LAB_EXECUTE: '/api/sql-lab/execute',
  SQL_LAB_QUERIES: '/api/sql-lab/queries',
  SQL_LAB_TEMPLATES: '/api/sql-lab/templates',
  SQL_LAB_HISTORY: '/api/sql-lab/history',
  SQL_LAB_AI_GENERATE: '/api/sql-lab/ai-generate',

  // Optimization
  OPTIMIZATION_RECOMMENDATIONS: '/api/optimization/recommendations',
  OPTIMIZATION_POTENTIAL: '/api/optimization/potential',

  // AWS Pricing (Already Implemented)
  AWS_PRICING: '/api/aws-pricing',

  // AI Insights
  AI_INSIGHTS: '/api/ai-insights/insights',
  AI_CHAT: '/api/ai-insights/chat',

  // Capacity Management
  CAPACITY_OVERVIEW: '/api/capacity/overview',

  // Allocation
  ALLOCATION_SUMMARY: '/api/allocation/summary',
} as const

export type APIEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]