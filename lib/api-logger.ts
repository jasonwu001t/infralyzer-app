import { NextRequest, NextResponse } from 'next/server'
import { logger, getUserInfo, createPerformanceTracker } from './logger'

export type ApiHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse

export function withApiLogging(handler: ApiHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const tracker = createPerformanceTracker()
    const userInfo = getUserInfo(req)
    const method = req.method
    const pathname = req.nextUrl.pathname
    
    // Log incoming API request (simplified)
    // Note: We'll log after completion to avoid duplication

    try {
      const response = await handler(req)
      const duration = tracker.end()
      
      // Log successful API response (simple)
      logger.logApiCall({
        path: pathname,
        method,
        duration,
        statusCode: response.status,
        userId: userInfo.userId
      })
      
      return response
    } catch (error) {
      const duration = tracker.end()
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Log API error (simple)
      logger.logError({
        path: pathname,
        method,
        duration,
        error: errorMessage,
        statusCode: 500,
        userId: userInfo.userId
      })
      
      // Return error response
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  }
}
