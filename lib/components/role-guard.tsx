'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { UserRole } from '@/lib/types/user'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
  requirePermission?: string
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null, 
  requirePermission 
}: RoleGuardProps) {
  const { user, hasPermission } = useAuth()

  // If no user is authenticated, don't show content
  if (!user) {
    return <>{fallback}</>
  }

  // Check role-based access
  const hasRoleAccess = allowedRoles.includes(user.role)
  
  // Check permission-based access if specified
  const hasPermissionAccess = requirePermission ? hasPermission(requirePermission) : true

  // Show content only if user has both role and permission access
  if (hasRoleAccess && hasPermissionAccess) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

interface PermissionGuardProps {
  children: ReactNode
  permission: string
  fallback?: ReactNode
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (hasPermission(permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// Convenience components for common role checks
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AnalystOrAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'analyst']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function ViewerRestricted({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin', 'analyst']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}