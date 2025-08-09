import { NextRequest, NextResponse } from 'next/server'

// Log initialization message once
let isInitialized = false
if (!isInitialized) {
  console.log('\x1b[36m📡 Terminal API logging service started - API calls will appear here\x1b[0m')
  isInitialized = true
}

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json()
    
    // Format timestamp for terminal display
    const timestamp = new Date().toLocaleTimeString()
    
    // Create colored terminal output
    const formatTerminalLog = (log: any) => {
      const { method, url, status, duration, requestData, error } = log
      
      if (error) {
        // Red color for errors
        return `\x1b[31m🔴 ${timestamp} │ API CALL ${method} ${url} → ERROR: ${error}\x1b[0m`
      } else {
        // Green color for success
        let message = `\x1b[32m🟢 ${timestamp} │ API CALL ${method} ${url} → ${status}\x1b[0m`
        
        if (duration) {
          message += `\x1b[36m in ${duration}ms\x1b[0m`
        }
        
        if (requestData && Object.keys(requestData).length > 0) {
          message += `\x1b[33m with data: ${JSON.stringify(requestData)}\x1b[0m`
        }
        
        return message
      }
    }
    
    // Print to terminal (server console)
    console.log(formatTerminalLog(logData))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log API call:', error)
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 })
  }
}
