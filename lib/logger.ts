export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  type: 'page_access' | 'api_call' | 'error' | 'system'
  userId?: string
  userAgent?: string
  ip?: string
  path: string
  method?: string
  statusCode?: number
  duration?: number
  error?: string
  details?: Record<string, any>
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private formatLogEntry(entry: LogEntry): string {
    const time = new Date(entry.timestamp).toLocaleTimeString()
    
    // Get visitor identifier - prefer IP, fallback to userId or 'anonymous'
    const getVisitor = () => {
      if (entry.ip && entry.ip !== 'unknown') return entry.ip
      if (entry.userId && entry.userId !== 'anonymous') return entry.userId
      return 'anonymous'
    }
    
    // Simple, clean format focused on key information
    if (entry.type === 'page_access') {
      return `🌐 ${time} │ ${getVisitor()} visited ${entry.path} ${entry.statusCode ? `(${entry.statusCode})` : ''} ${entry.duration ? `in ${entry.duration}ms` : ''}`
    }
    
    if (entry.type === 'api_call') {
      return `🔌 ${time} │ ${getVisitor()} called ${entry.method} ${entry.path} ${entry.statusCode ? `→ ${entry.statusCode}` : ''} ${entry.duration ? `in ${entry.duration}ms` : ''}`
    }
    
    if (entry.type === 'error') {
      return `❌ ${time} │ ERROR ${entry.path} ${entry.method || ''} - ${entry.error} ${entry.statusCode ? `(${entry.statusCode})` : ''}`
    }
    
    return `ℹ️  ${time} │ ${entry.details?.message || 'System event'}`
  }

  private log(entry: LogEntry) {
    const formattedLog = this.formatLogEntry(entry)
    
    switch (entry.level) {
      case 'error':
        console.error(formattedLog)
        break
      case 'warn':
        console.warn(formattedLog)
        break
      default:
        console.log(formattedLog)
    }
  }

  logPageAccess(options: {
    path: string
    userId?: string
    userAgent?: string
    ip?: string
    duration?: number
    statusCode?: number
  }) {
    this.log({
      timestamp: this.formatTimestamp(),
      level: 'info',
      type: 'page_access',
      ...options
    })
  }

  logApiCall(options: {
    path: string
    method: string
    userId?: string
    userAgent?: string
    ip?: string
    duration?: number
    statusCode?: number
    details?: Record<string, any>
  }) {
    this.log({
      timestamp: this.formatTimestamp(),
      level: 'info',
      type: 'api_call',
      ...options
    })
  }

  logError(options: {
    path: string
    method?: string
    userId?: string
    userAgent?: string
    ip?: string
    error: string
    statusCode?: number
    details?: Record<string, any>
  }) {
    this.log({
      timestamp: this.formatTimestamp(),
      level: 'error',
      type: 'error',
      ...options
    })
  }

  logSystem(message: string, details?: Record<string, any>) {
    this.log({
      timestamp: this.formatTimestamp(),
      level: 'info',
      type: 'system',
      path: 'system',
      details: { message, ...details }
    })
  }
}

export const logger = new Logger()

// Utility function to get user info (placeholder - implement based on your auth system)
export function getUserInfo(req?: Request): { userId?: string; userAgent?: string; ip?: string } {
  if (!req) return {}
  
  return {
    userId: req.headers.get('x-user-id') || 'anonymous', // Implement based on your auth
    userAgent: req.headers.get('user-agent') || undefined,
    ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  }
}

// Performance tracking utility
export function createPerformanceTracker() {
  const start = Date.now()
  
  return {
    end: () => Date.now() - start
  }
}
