'use client'

// Enhanced fetch wrapper to log API calls
let originalFetch: typeof fetch

// Only initialize on client side
if (typeof window !== 'undefined') {
  originalFetch = window.fetch
  console.log('🔧 Original fetch saved for interception')
}

interface ApiCallLog {
  timestamp: string
  method: string
  url: string
  requestData?: any
  responseStatus?: number
  duration?: number
  error?: string
}

function logApiCall(log: ApiCallLog) {
  const time = new Date(log.timestamp).toLocaleTimeString()
  
  if (log.error) {
    const errorMsg = `🔴 ${time} │ API CALL ${log.method} ${log.url} → ERROR: ${log.error}`
    console.log(errorMsg)
    console.error(errorMsg)
  } else {
    let message = `🟢 ${time} │ API CALL ${log.method} ${log.url} → ${log.responseStatus}`
    
    if (log.duration) {
      message += ` in ${log.duration}ms`
    }
    
    if (log.requestData && Object.keys(log.requestData).length > 0) {
      message += ` with data: ${JSON.stringify(log.requestData)}`
    }
    
    // Log to browser console with styling
    console.log(message)
    console.info(`%c${message}`, 'color: #10b981; font-weight: bold;')
  }
  
  // Simple terminal logging - send log to server without recursion
  sendToTerminalSafe(log)
}

// Simplified terminal logging that won't cause recursion
function sendToTerminalSafe(log: ApiCallLog) {
  // Use a different approach - only send to terminal for external API calls
  if (log.url.includes('127.0.0.1:8000') || log.url.includes('localhost:8000')) {
    const logData = {
      method: log.method,
      url: log.url,
      status: log.responseStatus,
      duration: log.duration,
      requestData: log.requestData,
      error: log.error,
      timestamp: log.timestamp
    }
    
    // Use originalFetch directly and don't await to avoid blocking
    originalFetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {
      // Ignore errors silently
    })
  }
}

// Override fetch to intercept API calls (only on client side)
if (typeof window !== 'undefined') {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const method = init?.method || 'GET'
    const startTime = Date.now()
    
    console.log(`🔍 Intercepting fetch call: ${method} ${url}`)
    
    // Exclude our own logging endpoint completely to prevent recursion
    if (url.includes('/api/logs')) {
      return originalFetch(input, init)
    }
    
    // Only log calls to external APIs (like your Python backend)
    const isExternalApiCall = url.includes('127.0.0.1:8000') || url.includes('localhost:8000')
    
    if (!isExternalApiCall) {
      return originalFetch(input, init)
    }
    
    let requestData: any = null
    
    // Extract request data for logging
    if (init?.body) {
      try {
        if (typeof init.body === 'string') {
          requestData = JSON.parse(init.body)
        } else if (init.body instanceof FormData) {
          requestData = Object.fromEntries(init.body.entries())
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    try {
      const response = await originalFetch(input, init)
      const duration = Date.now() - startTime
      
      logApiCall({
        timestamp: new Date().toISOString(),
        method,
        url,
        requestData,
        responseStatus: response.status,
        duration
      })
      
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      
      logApiCall({
        timestamp: new Date().toISOString(),
        method,
        url,
        requestData,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      throw error
    }
  }
  
  console.log('🔧 Fetch interceptor setup complete')
}

export function initializeApiInterceptor() {
  // This function can be called to ensure the interceptor is set up
  // It's automatically executed when this module is imported
  if (typeof window !== 'undefined') {
    console.log('🔧 API interceptor initialized - external API calls will be logged to browser console and terminal')
  }
}