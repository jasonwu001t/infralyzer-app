/**
 * Centralized API Configuration - Clean & Efficient
 */

// Core configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000',
  API_VERSION: '/api/v1',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
  
  // AWS & AI Configuration
  AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  // Claude Models: claude-4-sonnet-20250115-v1:0 | claude-3-7-sonnet-20250109-v1:0 | claude-3-5-sonnet-20241022-v2:0 | claude-3-5-haiku-20241022-v1:0
  BEDROCK_MODEL_ID: process.env.NEXT_PUBLIC_BEDROCK_MODEL_ID || 'anthropic.claude-3-7-sonnet-20250109-v1:0',
  
  // Settings
  ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI !== 'false',
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === 'true',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  MAX_RETRIES: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '1'),
  RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000'),
}

// Helper to build endpoints
const buildEndpoint = (path: string) => `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${path}`

// API Endpoints
export const API_ENDPOINTS = {
  FINOPS: {
    QUERY: buildEndpoint('/finops/query'),
    KPI: buildEndpoint('/finops/kpi'),
    OPTIMIZATION: buildEndpoint('/finops/optimization'),
    SPEND_ANALYTICS: buildEndpoint('/finops/spend-analytics'),
    ALLOCATION: buildEndpoint('/finops/allocation'),
    DISCOUNTS: buildEndpoint('/finops/discounts'),
  },
  BEDROCK: {
    GENERATE_QUERY: buildEndpoint('/finops/bedrock/generate-query'),
    AI_RECOMMENDATIONS: buildEndpoint('/finops/bedrock/recommendations'),
    AI_INSIGHTS: buildEndpoint('/finops/bedrock/insights'),
  },
  AWS_PRICING: {
    INSTANCES: buildEndpoint('/aws-pricing/instances'),
  }
}

/**
 * Default request headers
 */
export const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (API_CONFIG.API_KEY) {
    headers['Authorization'] = `Bearer ${API_CONFIG.API_KEY}`
  }
  
  return headers
}

/**
 * API Error class
 */
export class ApiError extends Error {
  public status?: number
  public endpoint: string
  public method: string
  public retryAttempts: number

  constructor(
    message: string, 
    status?: number, 
    endpoint = '', 
    method = 'GET',
    retryAttempts = 0
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.endpoint = endpoint
    this.method = method
    this.retryAttempts = retryAttempts
  }
}

/**
 * Enhanced fetch with retry logic
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  config: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    headers?: Record<string, string>
    body?: any
    timeout?: number
    retries?: number
  } = {}
): Promise<T> => {
  if (!endpoint) {
    throw new ApiError('Endpoint URL is required', undefined, endpoint, config.method)
  }

  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_CONFIG.TIMEOUT,
    retries = API_CONFIG.MAX_RETRIES
  } = config

  const requestHeaders = {
    ...getDefaultHeaders(),
    ...headers
  }

  const fetchConfig: RequestInit = {
    method,
    headers: requestHeaders,
    ...(body && { body: typeof body === 'string' ? body : JSON.stringify(body) })
  }

  if (API_CONFIG.DEBUG) {
    console.log(`[API] ${method} ${endpoint}`, { headers: requestHeaders, body })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  fetchConfig.signal = controller.signal

  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(endpoint, fetchConfig)
      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`
        
        try {
          const errorData = await response.json()
          
          // Handle different error response structures
          if (errorData.detail && typeof errorData.detail === 'object') {
            // Backend returns structured error with detail object (for HTTP 400 errors)
            // This contains: { error: string, suggestions: string[], metadata: object }
            errorMessage = errorData.detail.error || errorData.detail.message || errorMessage
            
            // Preserve the full structured error for frontend processing
            if (errorData.detail.suggestions || errorData.detail.metadata) {
              errorMessage = JSON.stringify(errorData.detail)
            }
          } else if (errorData.detail && typeof errorData.detail === 'string') {
            // Backend returns string error message in detail field
            errorMessage = errorData.detail
          } else if (errorData.message) {
            // Standard message field
            errorMessage = errorData.message
          } else if (errorData.error) {
            // Error field
            errorMessage = errorData.error
          }
        } catch (parseError) {
          // If JSON parsing fails, try to get response text
          try {
            const responseText = await response.text()
            if (responseText) {
              errorMessage = responseText
            }
          } catch {
            // Use default message if all parsing fails
          }
        }

        const apiError = new ApiError(errorMessage, response.status, endpoint, method, attempt)
        
        // Don't retry client errors (4xx) except 429
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw apiError
        }
        
        throw apiError
      }

      const data = await response.json()
      
      if (API_CONFIG.DEBUG) {
        console.log(`[API] ${method} ${endpoint} - Success`, data)
      }
      
      return data as T
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        lastError = error
      } else if (error instanceof Error) {
        if (error.name === 'AbortError') {
          lastError = new ApiError(`Request timeout after ${timeout}ms`, 408, endpoint, method, attempt)
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          lastError = new ApiError('Network error - check connection and backend URL', 0, endpoint, method, attempt)
        } else {
          lastError = new ApiError(error.message, undefined, endpoint, method, attempt)
        }
      } else {
        lastError = new ApiError('Unknown error occurred', undefined, endpoint, method, attempt)
      }
      
      if (API_CONFIG.DEBUG) {
        console.error(`[API] ${method} ${endpoint} - Attempt ${attempt + 1} failed:`, lastError)
      }
      
      // Don't retry on last attempt or client errors
      if (attempt === retries || (lastError.status && lastError.status >= 400 && lastError.status < 500 && lastError.status !== 429)) {
        break
      }
      
      // Wait before retrying with exponential backoff
      const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  if (lastError) {
    lastError.retryAttempts = retries
    throw lastError
  } else {
    throw new ApiError('Request failed with unknown error', undefined, endpoint, method, retries)
  }
}

/**
 * Utility functions for common API operations
 */
export const apiUtils = {
  executeQuery: async (query: string, engine = 'duckdb') => {
    return apiRequest(API_ENDPOINTS.FINOPS.QUERY, {
      method: 'POST',
      body: { query, engine }
    })
  },

  generateAIQuery: async (userQuery: string, modelConfig: any = {}) => {
    if (!API_CONFIG.ENABLE_AI) {
      throw new Error('AI features are disabled. Enable them by setting NEXT_PUBLIC_ENABLE_AI=true')
    }
    
    return apiRequest(API_ENDPOINTS.BEDROCK.GENERATE_QUERY, {
      method: 'POST',
      body: {
        user_query: userQuery,
        model_config: {
          model_id: API_CONFIG.BEDROCK_MODEL_ID,
          max_tokens: 4096,
          temperature: 0.1,
          top_p: 0.9,
          top_k: 250,
          ...modelConfig
        },
        include_examples: true,
        target_table: 'CUR'
      }
    })
  },

  getKPIData: async (filters: any = {}) => {
    return apiRequest(API_ENDPOINTS.FINOPS.KPI, {
      method: 'POST',
      body: filters
    })
  },

  getOptimizationData: async (filters: any = {}) => {
    return apiRequest(API_ENDPOINTS.FINOPS.OPTIMIZATION, {
      method: 'POST',
      body: filters
    })
  },

  getSpendAnalytics: async (filters: any = {}) => {
    return apiRequest(API_ENDPOINTS.FINOPS.SPEND_ANALYTICS, {
      method: 'POST',
      body: filters
    })
  }
}

/**
 * Health check function
 */
export const checkApiHealth = async () => {
  const startTime = Date.now()
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: getDefaultHeaders(),
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (response.ok) {
      try {
        const data = await response.json()
        return {
          isHealthy: true,
          status: 'healthy',
          responseTime,
          version: data.version || 'unknown'
        }
      } catch {
        return { isHealthy: true, status: 'healthy', responseTime }
      }
    } else {
      return {
        isHealthy: false,
        status: `unhealthy (${response.status})`,
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      isHealthy: false,
      status: 'unreachable',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export default API_CONFIG