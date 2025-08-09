import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger, getUserInfo, createPerformanceTracker } from './lib/logger'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userInfo = getUserInfo(request)
  const tracker = createPerformanceTracker()
  
  // Extract visitor IP address
  const getClientIP = () => {
    // Try different headers for getting real IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
    const xClientIP = request.headers.get('x-client-ip')
    
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, get the first one
      return forwarded.split(',')[0].trim()
    }
    
    return realIP || cfConnectingIP || xClientIP || 'unknown'
  }
  
  // Skip logging for API routes (they're handled by API logger)
  // Skip logging for internal Next.js routes and static files
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Create response
  const response = NextResponse.next()
  
  // Add custom headers for tracking
  response.headers.set('x-request-id', crypto.randomUUID())
  response.headers.set('x-timestamp', new Date().toISOString())
  
  // Log page access after response (simplified)
  setTimeout(() => {
    const duration = tracker.end()
    const clientIP = getClientIP()
    logger.logPageAccess({
      path: pathname,
      duration,
      statusCode: 200,
      userId: userInfo.userId,
      ip: clientIP,
      userAgent: userInfo.userAgent
    })
  }, 0)

  return response
}

export const config = {
  matcher: [
    /*
     * Only match actual page routes
     */
    '/((?!api|_next|favicon.ico|.*\\.).*)',
  ],
}
