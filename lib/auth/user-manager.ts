// User management system for Infralyzer application

import { User, UserSession, UserData, UserPreferences, ROLE_PERMISSIONS } from '@/lib/types/user'

// Demo users for testing and demonstration
export const DEMO_USERS: User[] = [
  {
    id: 'user_admin_001',
    email: 'admin@techcorp.com',
    name: 'Alexandra Chen',
    role: 'admin',
    organization: 'TechCorp Inc.',
    avatar: '',
    preferences: {
      theme: 'dark',
      defaultTimeRange: '30d',
      defaultCurrency: 'USD',
      defaultRegion: 'us-east-1',
      dashboardLayout: ['kpis', 'trends', 'breakdown', 'alerts'],
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        anomalyAlerts: true,
        weeklyReports: true,
        costOptimizationTips: true
      },
      language: 'en'
    },
    createdAt: '2024-01-15T08:00:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'user_analyst_002',
    email: 'sarah.analyst@techcorp.com',
    name: 'Sarah Mitchell',
    role: 'analyst',
    organization: 'TechCorp Inc.',
    avatar: '',
    preferences: {
      theme: 'light',
      defaultTimeRange: '7d',
      defaultCurrency: 'USD',
      defaultRegion: 'us-west-2',
      dashboardLayout: ['kpis', 'breakdown', 'trends'],
      notifications: {
        email: true,
        push: false,
        budgetAlerts: true,
        anomalyAlerts: true,
        weeklyReports: false,
        costOptimizationTips: true
      },
      language: 'en'
    },
    createdAt: '2024-02-01T10:30:00Z',
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'user_analyst_003',
    email: 'david.cost@techcorp.com',
    name: 'David Rodriguez',
    role: 'analyst',
    organization: 'TechCorp Inc.',
    avatar: '',
    preferences: {
      theme: 'system',
      defaultTimeRange: '90d',
      defaultCurrency: 'USD',
      defaultRegion: 'eu-west-1',
      dashboardLayout: ['trends', 'kpis', 'breakdown', 'optimization'],
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        anomalyAlerts: false,
        weeklyReports: true,
        costOptimizationTips: true
      },
      language: 'en'
    },
    createdAt: '2024-01-20T14:15:00Z',
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: 'user_viewer_004',
    email: 'mike.viewer@techcorp.com',
    name: 'Mike Johnson',
    role: 'viewer',
    organization: 'TechCorp Inc.',
    avatar: '',
    preferences: {
      theme: 'light',
      defaultTimeRange: '30d',
      defaultCurrency: 'USD',
      defaultRegion: 'us-east-1',
      dashboardLayout: ['kpis', 'trends'],
      notifications: {
        email: false,
        push: false,
        budgetAlerts: false,
        anomalyAlerts: false,
        weeklyReports: false,
        costOptimizationTips: false
      },
      language: 'en'
    },
    createdAt: '2024-02-10T09:00:00Z',
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: 'user_admin_005',
    email: 'demo@startup.io',
    name: 'Alex Founder',
    role: 'admin',
    organization: 'StartupCo',
    avatar: '',
    preferences: {
      theme: 'dark',
      defaultTimeRange: '7d',
      defaultCurrency: 'USD',
      defaultRegion: 'us-west-1',
      dashboardLayout: ['kpis', 'alerts', 'trends', 'optimization'],
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        anomalyAlerts: true,
        weeklyReports: true,
        costOptimizationTips: true
      },
      language: 'en'
    },
    createdAt: '2024-01-05T12:00:00Z',
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
  }
]

// User credentials for demo login (in real app, this would be hashed)
export const USER_CREDENTIALS = [
  { email: 'admin@techcorp.com', password: 'admin123' },
  { email: 'sarah.analyst@techcorp.com', password: 'analyst123' },
  { email: 'david.cost@techcorp.com', password: 'analyst456' },
  { email: 'mike.viewer@techcorp.com', password: 'viewer123' },
  { email: 'demo@startup.io', password: 'demo123' }
]

class UserManager {
  private static instance: UserManager
  private readonly SESSION_KEY = 'infralyzer_user_session'
  private readonly USER_DATA_PREFIX = 'infralyzer_user_data_'

  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager()
    }
    return UserManager.instance
  }

  // Authentication methods
  async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Find user credentials
      const credentials = USER_CREDENTIALS.find(cred => cred.email.toLowerCase() === email.toLowerCase())
      if (!credentials || credentials.password !== password) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Find user profile
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (!user) {
        return { success: false, error: 'User profile not found' }
      }

      // Create session
      const session = this.createSession(user)
      this.saveSession(session)

      // Update last login
      user.lastLoginAt = new Date().toISOString()

      // Initialize user data if not exists
      this.initializeUserData(user.id)

      return { success: true, user }
    } catch (error) {
      console.error('Authentication error:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  createSession(user: User): UserSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 hours

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: user.organization,
      loginTime: Date.now(),
      expiresAt,
      sessionId
    }
  }

  saveSession(session: UserSession): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  getCurrentSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const session: UserSession = JSON.parse(sessionData)
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout()
        return null
      }

      return session
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }

  getCurrentUser(): User | null {
    const session = this.getCurrentSession()
    if (!session) return null

    return DEMO_USERS.find(user => user.id === session.userId) || null
  }

  logout(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY)
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  hasPermission(permission: keyof typeof ROLE_PERMISSIONS.admin): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const permissions = ROLE_PERMISSIONS[user.role]
    return permissions[permission] as boolean
  }

  // User data management
  initializeUserData(userId: string): void {
    const dataKey = `${this.USER_DATA_PREFIX}${userId}`
    
    try {
      const existingData = localStorage.getItem(dataKey)
      if (existingData) return // Data already exists

      // Initialize with default user data
      const user = DEMO_USERS.find(u => u.id === userId)
      if (!user) return

      const initialData: UserData = {
        dashboard: {
          filters: {
            accounts: [],
            services: [],
            regions: [],
            tags: {},
            costRange: { min: 0, max: 100000 },
            timeRange: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              end: new Date().toISOString()
            },
            comparisonMode: false
          },
          customKpis: [],
          sharedLinks: []
        },
        sqlLab: {
          savedQueries: this.getInitialSavedQueries(userId),
          queryHistory: this.getInitialQueryHistory(userId),
          queryResults: {}
        },
        aiChat: {
          conversations: this.getInitialChatConversations(userId),
          insights: []
        },
        costAnalytics: {
          customReports: [],
          exportHistory: []
        },
        preferences: user.preferences
      }

      localStorage.setItem(dataKey, JSON.stringify(initialData))
    } catch (error) {
      console.error('Failed to initialize user data:', error)
    }
  }

  getUserData(userId?: string): UserData | null {
    const targetUserId = userId || this.getCurrentSession()?.userId
    if (!targetUserId) return null

    try {
      const dataKey = `${this.USER_DATA_PREFIX}${targetUserId}`
      const data = localStorage.getItem(dataKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to get user data:', error)
      return null
    }
  }

  updateUserData(updates: Partial<UserData>, userId?: string): boolean {
    const targetUserId = userId || this.getCurrentSession()?.userId
    if (!targetUserId) return false

    try {
      const dataKey = `${this.USER_DATA_PREFIX}${targetUserId}`
      const currentData = this.getUserData(targetUserId) || {} as UserData
      const updatedData = { ...currentData, ...updates }
      
      localStorage.setItem(dataKey, JSON.stringify(updatedData))
      return true
    } catch (error) {
      console.error('Failed to update user data:', error)
      return false
    }
  }

  // Initialize demo data for different users
  private getInitialSavedQueries(userId: string) {
    const user = DEMO_USERS.find(u => u.id === userId)
    if (!user) return []

    // Different users get different sample queries
    if (user.role === 'admin') {
      return [
        {
          id: 'query_1',
          userId,
          name: 'Monthly EC2 Costs by Account',
          description: 'Break down EC2 costs across all accounts for the current month',
          query: `SELECT 
  line_item_usage_account_id as account_id,
  SUM(line_item_blended_cost) as total_cost,
  COUNT(*) as line_items
FROM cur_table 
WHERE line_item_product_code = 'AmazonEC2'
  AND month = date_format(current_date, '%Y-%m')
GROUP BY line_item_usage_account_id
ORDER BY total_cost DESC`,
          tags: ['ec2', 'monthly', 'accounts'],
          isPublic: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          executionCount: 12
        },
        {
          id: 'query_2',
          userId,
          name: 'Top 10 Most Expensive Resources',
          query: `SELECT 
  line_item_resource_id,
  line_item_product_code as service,
  SUM(line_item_blended_cost) as total_cost
FROM cur_table 
WHERE line_item_usage_start_date >= date_sub(current_date, interval 30 day)
GROUP BY line_item_resource_id, line_item_product_code
ORDER BY total_cost DESC
LIMIT 10`,
          tags: ['resources', 'top-costs', 'optimization'],
          isPublic: false,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          lastExecuted: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          executionCount: 8
        }
      ]
    } else if (user.role === 'analyst') {
      return [
        {
          id: 'query_3',
          userId,
          name: 'RDS Cost Trend Analysis',
          description: 'Analyze RDS costs over the past 3 months',
          query: `SELECT 
  DATE_FORMAT(line_item_usage_start_date, '%Y-%m') as month,
  SUM(line_item_blended_cost) as total_cost,
  AVG(line_item_blended_cost) as avg_daily_cost
FROM cur_table 
WHERE line_item_product_code = 'AmazonRDS'
  AND line_item_usage_start_date >= date_sub(current_date, interval 3 month)
GROUP BY DATE_FORMAT(line_item_usage_start_date, '%Y-%m')
ORDER BY month`,
          tags: ['rds', 'trend', 'analysis'],
          isPublic: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          lastExecuted: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          executionCount: 5
        }
      ]
    }

    return []
  }

  private getInitialQueryHistory(userId: string) {
    const user = DEMO_USERS.find(u => u.id === userId)
    if (!user || user.role === 'viewer') return []

    return [
      {
        id: 'history_1',
        userId,
        query: 'SELECT COUNT(*) FROM cur_table WHERE line_item_usage_start_date >= current_date',
        status: 'success' as const,
        executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 1250,
        resultRows: 1
      },
      {
        id: 'history_2',
        userId,
        query: 'SELECT line_item_product_code, SUM(line_item_blended_cost) FROM cur_table GROUP BY line_item_product_code',
        status: 'success' as const,
        executedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        duration: 3500,
        resultRows: 47
      }
    ]
  }

  private getInitialChatConversations(userId: string) {
    const user = DEMO_USERS.find(u => u.id === userId)
    if (!user || user.role === 'viewer') return []

    return [
      {
        id: 'chat_1',
        userId,
        title: 'EC2 Cost Optimization',
        messages: [
          {
            id: 'msg_1',
            type: 'user' as const,
            content: 'What are the biggest opportunities to reduce our EC2 costs?',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'msg_2',
            type: 'assistant' as const,
            content: 'Based on your usage patterns, I identified 3 key optimization opportunities:\n\n1. **Right-sizing**: 23% of your EC2 instances are oversized, potentially saving $2,400/month\n2. **Spot Instances**: 67% of your dev/test workloads could use Spot instances, saving $1,800/month\n3. **Reserved Instances**: High utilization workloads could benefit from 1-year RIs, saving $3,200/month\n\nWould you like me to generate specific recommendations for any of these areas?',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 30000).toISOString(),
            metadata: {
              insights: ['right-sizing', 'spot-instances', 'reserved-instances'],
              recommendations: ['Resize m5.2xlarge to m5.large', 'Convert dev instances to Spot', 'Purchase RIs for production workloads']
            }
          }
        ],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000 + 30000).toISOString()
      }
    ]
  }
}

export const userManager = UserManager.getInstance()
export default UserManager