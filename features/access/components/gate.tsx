"use client"

import { useRouter } from 'next/navigation'
import { createContext, useContext, useMemo, useEffect } from 'react'

import type {
  UserSession,
  RolePermissionMap,
  AccessManagerContextType,
  AccessManagerProviderProps,
  AccessGateProps,
  PermissionCheckProps,
  ConditionalWrapperProps,
  SessionGuardProps,
} from '@/features/access/types/access'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from '@/features/shadcn/utils/cn'

// Re-export types for backward compatibility
export type {
  UserSession,
  RolePermissionMap,
  AccessManagerContextType,
  AccessManagerProviderProps,
  AccessGateProps,
  PermissionCheckProps,
  ConditionalWrapperProps,
  SessionGuardProps,
}

const AccessManagerContext = createContext<AccessManagerContextType | null>(null)

export const useAccessManager = () => {
  const context = useContext(AccessManagerContext)
  if (!context) {
    throw new Error('useAccessManager must be used within an AccessManagerProvider')
  }
  return context
}

export const useRoleBasedAccess = useAccessManager

export function AccessManagerProvider({
  children,
  user,
  rolePermissionMap = {}
}: AccessManagerProviderProps) {
  const contextValue = useMemo(() => {
    const hasRole = (role: string | string[]): boolean => {
      if (!user || !user.roles) return false
      if (Array.isArray(role)) {
        return role.some(r => user.roles.includes(r))
      }
      return user.roles.includes(role)
    }

    const hasPermission = (permission: string | string[]): boolean => {
      if (!user) return false

      const userPermissions = new Set([
        ...(user.permissions || []),
        ...user.roles.flatMap(role => rolePermissionMap[role] || [])
      ])

      if (Array.isArray(permission)) {
        return permission.some(p => userPermissions.has(p))
      }
      return userPermissions.has(permission)
    }

    const hasAnyRole = (roles: string[]): boolean => {
      if (!user || !user.roles) return false
      return roles.some(role => user.roles.includes(role))
    }

    const hasAllRoles = (roles: string[]): boolean => {
      if (!user || !user.roles) return false
      return roles.every(role => user.roles.includes(role))
    }

    const hasAnyPermission = (permissions: string[]): boolean => {
      if (!user) return false

      const userPermissions = new Set([
        ...(user.permissions || []),
        ...user.roles.flatMap(role => rolePermissionMap[role] || [])
      ])

      return permissions.some(permission => userPermissions.has(permission))
    }

    const hasAllPermissions = (permissions: string[]): boolean => {
      if (!user) return false

      const userPermissions = new Set([
        ...(user.permissions || []),
        ...user.roles.flatMap(role => rolePermissionMap[role] || [])
      ])

      return permissions.every(permission => userPermissions.has(permission))
    }

    const isSessionValid = (): boolean => {
      if (!user) return false
      if (user.isActive === false) return false

      if (user.expiresAt) {
        const expirationDate = typeof user.expiresAt === 'string'
          ? new Date(user.expiresAt)
          : user.expiresAt
        return expirationDate > new Date()
      }

      return true
    }

    const getSessionTimeRemaining = (): number | null => {
      if (!user || !user.expiresAt) return null

      const expirationDate = typeof user.expiresAt === 'string'
        ? new Date(user.expiresAt)
        : user.expiresAt

      const now = new Date()
      const timeRemaining = expirationDate.getTime() - now.getTime()

      return timeRemaining > 0 ? timeRemaining : 0
    }

    const isSessionExpiring = (thresholdMinutes: number = 5): boolean => {
      if (!user || !user.expiresAt) return false

      const expirationDate = typeof user.expiresAt === 'string'
        ? new Date(user.expiresAt)
        : user.expiresAt

      const now = new Date()
      const timeUntilExpiry = expirationDate.getTime() - now.getTime()
      const thresholdMs = thresholdMinutes * 60 * 1000

      return timeUntilExpiry > 0 && timeUntilExpiry <= thresholdMs
    }

    return {
      user,
      rolePermissionMap,
      hasRole,
      hasPermission,
      hasAnyRole,
      hasAllRoles,
      hasAnyPermission,
      hasAllPermissions,
      isSessionValid,
      getSessionTimeRemaining,
      isSessionExpiring
    }
  }, [user, rolePermissionMap])

  return (
    <AccessManagerContext.Provider value={contextValue}>
      {children}
    </AccessManagerContext.Provider>
  )
}

export function AccessGate({
  children,
  roles,
  permissions,
  requireAllRoles = false,
  requireAllPermissions = false,
  requireValidSession = true,
  fallback = null,
  onUnauthorized,
  mode = 'hide',
  className,
  disabledClassName,
  tooltip
}: AccessGateProps) {
  const {
    hasRole,
    hasPermission,
    hasAllRoles,
    hasAllPermissions,
    isSessionValid
  } = useAccessManager()

  const checkAccess = (): boolean => {
    if (requireValidSession && !isSessionValid()) {
      return false
    }

    let hasRequiredRoles = true
    let hasRequiredPermissions = true

    if (roles) {
      const roleArray = Array.isArray(roles) ? roles : [roles]
      hasRequiredRoles = requireAllRoles
        ? hasAllRoles(roleArray)
        : hasRole(roles)
    }

    if (permissions) {
      const permissionArray = Array.isArray(permissions) ? permissions : [permissions]
      hasRequiredPermissions = requireAllPermissions
        ? hasAllPermissions(permissionArray)
        : hasPermission(permissions)
    }

    return hasRequiredRoles && hasRequiredPermissions
  }

  const hasAccess = checkAccess()

  if (!hasAccess && onUnauthorized) {
    onUnauthorized()
  }

  if (!hasAccess) {
    switch (mode) {
      case 'hide':
        return fallback ? <>{fallback}</> : null
      case 'show-fallback':
        return fallback ? <>{fallback}</> : null
      case 'disable':
        const disabledContent = (
          <div className={cn(className, disabledClassName, "opacity-50 pointer-events-none cursor-not-allowed")}>
            {children}
          </div>
        )

        if (tooltip) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div tabIndex={0}>
                  {disabledContent}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )
        }

        return disabledContent
      default:
        return null
    }
  }

  const content = <div className={className}>{children}</div>

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function usePermissionCheck({
  roles,
  permissions,
  requireAllRoles = false,
  requireAllPermissions = false,
  requireValidSession = true
}: PermissionCheckProps = {}) {
  const {
    hasRole,
    hasPermission,
    hasAllRoles,
    hasAllPermissions,
    isSessionValid
  } = useAccessManager()

  return useMemo(() => {
    if (requireValidSession && !isSessionValid()) {
      return false
    }

    let hasRequiredRoles = true
    let hasRequiredPermissions = true

    if (roles) {
      const roleArray = Array.isArray(roles) ? roles : [roles]
      hasRequiredRoles = requireAllRoles
        ? hasAllRoles(roleArray)
        : hasRole(roles)
    }

    if (permissions) {
      const permissionArray = Array.isArray(permissions) ? permissions : [permissions]
      hasRequiredPermissions = requireAllPermissions
        ? hasAllPermissions(permissionArray)
        : hasPermission(permissions)
    }

    return hasRequiredRoles && hasRequiredPermissions
  }, [
    roles,
    permissions,
    requireAllRoles,
    requireAllPermissions,
    requireValidSession,
    hasRole,
    hasPermission,
    hasAllRoles,
    hasAllPermissions,
    isSessionValid
  ])
}

export function ConditionalWrapper({
  children,
  roles,
  permissions,
  requireAllRoles = false,
  requireAllPermissions = false,
  requireValidSession = true,
  wrapper,
  fallbackWrapper
}: ConditionalWrapperProps) {
  const hasAccess = usePermissionCheck({
    roles,
    permissions,
    requireAllRoles,
    requireAllPermissions,
    requireValidSession
  })

  if (hasAccess) {
    return <>{wrapper(children)}</>
  }

  if (fallbackWrapper) {
    return <>{fallbackWrapper(children)}</>
  }

  return <>{children}</>
}

export function SessionGuard({
  children,
  fallback,
  redirectTo,
  onSessionExpired
}: SessionGuardProps) {
  const { user, isSessionValid } = useAccessManager()
  const router = useRouter()

  const sessionValid = isSessionValid()
  const isAuthorized = user && sessionValid

  useEffect(() => {
    if (!isAuthorized) {
      if (onSessionExpired) {
        onSessionExpired()
      }

      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [isAuthorized, onSessionExpired, redirectTo, router])

  if (!isAuthorized) {
    if (redirectTo) {
      return null
    }

    if (fallback) {
      return <>{fallback}</>
    }

    return null
  }

  return <>{children}</>
}

export const RoleBasedAccessProvider = AccessManagerProvider
export const RoleGate = AccessGate

export const RoleBasedAccess = {
  Provider: AccessManagerProvider,
  Gate: AccessGate,
  SessionGuard,
  ConditionalWrapper,
  useRoleBasedAccess: useAccessManager,
  usePermissionCheck
}
