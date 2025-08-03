"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/hooks/use-auth"
import { DEMO_USERS } from "@/lib/auth/user-manager"
import { Loader2, Crown, Eye, BarChart3, User, Building, Clock } from "lucide-react"

const roleIcons = {
  admin: Crown,
  analyst: BarChart3,
  viewer: Eye
}

const roleColors = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  analyst: "bg-blue-100 text-blue-800 border-blue-200", 
  viewer: "bg-green-100 text-green-800 border-green-200"
}

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState<string | null>(null)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await login(email, password)
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Redirecting to your dashboard...",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (email: string, password: string, userId: string) => {
    setLoadingUser(userId)
    try {
      const result = await login(email, password)
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user?.name}!`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Authentication failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoadingUser(null)
    }
  }

  const formatLastLogin = (lastLogin: string) => {
    const date = new Date(lastLogin)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Manual Login Form */}
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your FinOps dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="your.email@company.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="Enter your password" 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or try demo accounts
          </span>
        </div>
      </div>

      {/* Demo Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Demo Accounts</CardTitle>
          <CardDescription>
            Try different user roles and see how data varies by user perspective
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {DEMO_USERS.map((user) => {
              const RoleIcon = roleIcons[user.role]
              const isLoading = loadingUser === user.id
              
              return (
                <Card 
                  key={user.id} 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => {
                    const credentials = [
                      { email: 'admin@techcorp.com', password: 'admin123' },
                      { email: 'sarah.analyst@techcorp.com', password: 'analyst123' },
                      { email: 'david.cost@techcorp.com', password: 'analyst456' },
                      { email: 'mike.viewer@techcorp.com', password: 'viewer123' },
                      { email: 'demo@startup.io', password: 'demo123' }
                    ].find(cred => cred.email === user.email)
                    
                    if (credentials) {
                      handleQuickLogin(credentials.email, credentials.password, user.id)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <Badge variant="outline" className={roleColors[user.role]}>
                              <RoleIcon className="mr-1 h-3 w-3" />
                              {user.role}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Building className="h-3 w-3" />
                              <span>{user.organization}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>Last seen {formatLastLogin(user.lastLoginAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Button variant="ghost" size="sm">
                            Login
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Demo Credentials:</strong> Each user has different data, permissions, and saved queries. 
                Admin users see all features, Analysts can run queries and export data, Viewers have read-only access.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-xs font-semibold text-blue-800 mb-2">Quick Reference - Email & Password:</p>
              <div className="grid grid-cols-1 gap-1 text-xs text-blue-700">
                <div><strong>Alexandra (Admin):</strong> admin@techcorp.com / admin123</div>
                <div><strong>Sarah (Analyst):</strong> sarah.analyst@techcorp.com / analyst123</div>
                <div><strong>David (Analyst):</strong> david.cost@techcorp.com / analyst456</div>
                <div><strong>Mike (Viewer):</strong> mike.viewer@techcorp.com / viewer123</div>
                <div><strong>Alex (Startup):</strong> demo@startup.io / demo123</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
