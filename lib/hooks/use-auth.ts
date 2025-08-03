'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, UserSession, UserData } from '@/lib/types/user'
import { userManager } from '@/lib/auth/user-manager'

interface AuthState {
  user: User | null
  session: UserSession | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshSession: () => void
  hasPermission: (permission: string) => boolean
  updateUserData: (updates: Partial<UserData>) => boolean
  getUserData: () => UserData | null
}

export function useAuth(): AuthState & AuthActions {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true
  })

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const session = userManager.getCurrentSession()
        const user = userManager.getCurrentUser()
        
        setAuthState({
          user,
          session,
          isAuthenticated: !!session && !!user,
          isLoading: false
        })
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    checkAuth()

    // Listen for storage changes (user logged in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'infralyzer_user_session') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await userManager.authenticateUser(email, password)
      
      if (result.success && result.user) {
        const session = userManager.getCurrentSession()
        setAuthState({
          user: result.user,
          session,
          isAuthenticated: true,
          isLoading: false
        })
      }
      
      return result
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Login failed' }
    }
  }, [])

  const logout = useCallback(() => {
    try {
      userManager.logout()
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  const refreshSession = useCallback(() => {
    const session = userManager.getCurrentSession()
    const user = userManager.getCurrentUser()
    
    setAuthState(prev => ({
      ...prev,
      user,
      session,
      isAuthenticated: !!session && !!user
    }))
  }, [])

  const hasPermission = useCallback((permission: string) => {
    return userManager.hasPermission(permission as any)
  }, [])

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    return userManager.updateUserData(updates)
  }, [])

  const getUserData = useCallback(() => {
    return userManager.getUserData()
  }, [])

  return {
    ...authState,
    login,
    logout,
    refreshSession,
    hasPermission,
    updateUserData,
    getUserData
  }
}

// Hook for user-specific data management
export function useUserData() {
  const { user, isAuthenticated } = useAuth()
  
  const getUserData = useCallback(() => {
    if (!isAuthenticated || !user) return null
    return userManager.getUserData(user.id)
  }, [user, isAuthenticated])

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    if (!isAuthenticated || !user) return false
    return userManager.updateUserData(updates, user.id)
  }, [user, isAuthenticated])

  const getDashboardFilters = useCallback(() => {
    const data = getUserData()
    return data?.dashboard.filters || null
  }, [getUserData])

  const updateDashboardFilters = useCallback((filters: any) => {
    const currentData = getUserData()
    if (!currentData) return false
    
    return updateUserData({
      dashboard: {
        ...currentData.dashboard,
        filters
      }
    })
  }, [getUserData, updateUserData])

  const getSavedQueries = useCallback(() => {
    const data = getUserData()
    return data?.sqlLab.savedQueries || []
  }, [getUserData])

  const addSavedQuery = useCallback((query: any) => {
    const currentData = getUserData()
    if (!currentData) return false

    const newQueries = [...currentData.sqlLab.savedQueries, query]
    return updateUserData({
      sqlLab: {
        ...currentData.sqlLab,
        savedQueries: newQueries
      }
    })
  }, [getUserData, updateUserData])

  const getQueryHistory = useCallback(() => {
    const data = getUserData()
    return data?.sqlLab.queryHistory || []
  }, [getUserData])

  const addQueryHistory = useCallback((historyItem: any) => {
    const currentData = getUserData()
    if (!currentData) return false

    const newHistory = [historyItem, ...currentData.sqlLab.queryHistory].slice(0, 50) // Keep last 50
    return updateUserData({
      sqlLab: {
        ...currentData.sqlLab,
        queryHistory: newHistory
      }
    })
  }, [getUserData, updateUserData])

  const getChatConversations = useCallback(() => {
    const data = getUserData()
    return data?.aiChat.conversations || []
  }, [getUserData])

  const addChatConversation = useCallback((conversation: any) => {
    const currentData = getUserData()
    if (!currentData) return false

    const newConversations = [...currentData.aiChat.conversations, conversation]
    return updateUserData({
      aiChat: {
        ...currentData.aiChat,
        conversations: newConversations
      }
    })
  }, [getUserData, updateUserData])

  const updateChatConversation = useCallback((conversationId: string, updates: any) => {
    const currentData = getUserData()
    if (!currentData) return false

    const updatedConversations = currentData.aiChat.conversations.map(conv =>
      conv.id === conversationId ? { ...conv, ...updates } : conv
    )

    return updateUserData({
      aiChat: {
        ...currentData.aiChat,
        conversations: updatedConversations
      }
    })
  }, [getUserData, updateUserData])

  return {
    user,
    isAuthenticated,
    getUserData,
    updateUserData,
    getDashboardFilters,
    updateDashboardFilters,
    getSavedQueries,
    addSavedQuery,
    getQueryHistory,
    addQueryHistory,
    getChatConversations,
    addChatConversation,
    updateChatConversation
  }
}