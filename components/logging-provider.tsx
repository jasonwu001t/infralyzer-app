'use client'

import { useEffect } from 'react'
import { initializeApiInterceptor } from '@/lib/api-interceptor'

export function LoggingProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize API call interceptor
    initializeApiInterceptor()
    
    // Simple error logging only
    const handleError = (event: ErrorEvent) => {
      console.error(`❌ ${new Date().toLocaleTimeString()} │ JS Error: ${event.message} at ${event.filename}:${event.lineno}`)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error(`❌ ${new Date().toLocaleTimeString()} │ Unhandled Promise: ${event.reason}`)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}
