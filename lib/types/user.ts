// User types and interfaces for the Infralyzer application

export type UserRole = 'admin' | 'analyst' | 'viewer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
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

export interface UserSession {
  userId: string
  email: string
  name: string
  role: UserRole
  organization: string
  loginTime: number
  expiresAt: number
  sessionId: string
}

export interface DashboardFilters {
  accounts: string[]
  services: string[]
  regions: string[]
  tags: Record<string, string>
  costRange: {
    min: number
    max: number
  }
  timeRange: {
    start: string
    end: string
  }
  comparisonMode: boolean
  comparisonTimeRange?: {
    start: string
    end: string
  }
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

export interface ChatConversation {
  id: string
  userId: string
  messages: ChatMessage[]
  title: string
  createdAt: string
  lastUpdated: string
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

export interface UserData {
  dashboard: {
    filters: DashboardFilters
    customKpis: any[]
    sharedLinks: any[]
  }
  sqlLab: {
    savedQueries: SavedQuery[]
    queryHistory: QueryHistory[]
    queryResults: Record<string, any[]>
  }
  aiChat: {
    conversations: ChatConversation[]
    insights: any[]
  }
  costAnalytics: {
    customReports: any[]
    exportHistory: any[]
  }
  preferences: UserPreferences
}

// Role permissions
export const ROLE_PERMISSIONS = {
  admin: {
    canManageUsers: true,
    canExportData: true,
    canAccessAllReports: true,
    canModifySettings: true,
    canShareDashboards: true,
    canExecuteQueries: true,
    canUseLAICost: true,
    maxSavedQueries: 100,
    maxChatHistory: 50
  },
  analyst: {
    canManageUsers: false,
    canExportData: true,
    canAccessAllReports: true,
    canModifySettings: false,
    canShareDashboards: true,
    canExecuteQueries: true,
    canUseAICost: true,
    maxSavedQueries: 50,
    maxChatHistory: 30
  },
  viewer: {
    canManageUsers: false,
    canExportData: false,
    canAccessAllReports: false,
    canModifySettings: false,
    canShareDashboards: false,
    canExecuteQueries: false,
    canUseAICost: false,
    maxSavedQueries: 10,
    maxChatHistory: 10
  }
} as const

export type RolePermissions = typeof ROLE_PERMISSIONS[UserRole]