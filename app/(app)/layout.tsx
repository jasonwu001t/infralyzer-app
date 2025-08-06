"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import Sidebar from "./components/sidebar"
import Header from "./components/header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, login } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const autoLoginInDev = async () => {
      // Auto-login demo user in development for easier testing
      if (process.env.NODE_ENV === 'development' && !isLoading && !isAuthenticated) {
        try {
          console.log('🔄 Auto-logging in demo admin user for development...')
          const result = await login('admin@techcorp.com', 'admin123')
          if (result.success) {
            console.log('✅ Auto-login successful!')
            return // Don't redirect, user is now logged in
          } else {
            console.log('❌ Auto-login failed, redirecting to login page')
          }
        } catch (error) {
          console.error('Auto-login error:', error)
        }
      }
      
      // Fallback: redirect to login if still not authenticated
      if (!isLoading && !isAuthenticated) {
        router.push('/login')
      }
    }

    autoLoginInDev()
  }, [isLoading, isAuthenticated, router, login])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Don't render content if not authenticated (router will handle redirect)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/40">{children}</main>
      </div>
    </div>
  )
}
