/**
 * Access control feature type definitions
 *
 * Defines types for AccessGate, AccessManagerProvider, and related access control components.
 * These types support role-based and permission-based access control patterns.
 */

import type { ReactNode } from 'react';

/**
 * User session interface for access control
 *
 * Contains user identity, roles, permissions, and session metadata.
 * The roles array is used by AccessGate to determine access rights.
 */
export interface UserSession {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email?: string;
  /** User's username */
  username?: string;
  /** User's display name */
  name?: string;
  /** URL to user's avatar image */
  avatar?: string;
  /** Array of role identifiers assigned to the user (e.g., FREE, PRO, ENTERPRISE) */
  roles: string[];
  /** Array of permission identifiers granted to the user */
  permissions: string[];
  /** Additional user metadata */
  metadata?: Record<string, unknown>;
  /** Whether the user's account is active */
  isActive?: boolean;
  /** When the session expires */
  expiresAt?: Date | string;
  /** Last activity timestamp */
  lastActivity?: Date | string;
  /** Unique session identifier */
  sessionId?: string;
}

/**
 * Role to permission mapping
 *
 * Maps role identifiers to arrays of permission identifiers.
 * Used to derive permissions from assigned roles.
 */
export interface RolePermissionMap {
  [role: string]: string[];
}

/**
 * AccessManagerProvider component props
 *
 * Provides access control context to child components.
 * Wraps the application or a section to enable role/permission checks.
 */
export interface AccessManagerProviderProps {
  /** Child components that will have access to the context */
  children: ReactNode;
  /** Current user session, or null if not authenticated */
  user: UserSession | null;
  /** Optional mapping of roles to permissions */
  rolePermissionMap?: RolePermissionMap;
  /** Optional callback when user lacks authorization */
  onUnauthorized?: () => void;
}

/**
 * AccessGate component props
 *
 * Controls visibility/interactivity of child content based on user roles and permissions.
 * Supports multiple modes: hide, disable, or show fallback content.
 */
export interface AccessGateProps {
  /** Content to protect with access control */
  children: ReactNode;
  /** Required role(s) - user must have at least one (or all if requireAllRoles is true) */
  roles?: string | string[];
  /** Required permission(s) - user must have at least one (or all if requireAllPermissions is true) */
  permissions?: string | string[];
  /** If true, user must have ALL specified roles */
  requireAllRoles?: boolean;
  /** If true, user must have ALL specified permissions */
  requireAllPermissions?: boolean;
  /** If true, also validates that the session is not expired */
  requireValidSession?: boolean;
  /** Content to show when access is denied */
  fallback?: ReactNode;
  /** Callback when access is denied */
  onUnauthorized?: () => void;
  /** How to handle denied access: hide content, disable it, or show fallback */
  mode?: 'hide' | 'disable' | 'show-fallback';
  /** CSS class applied to the wrapper div */
  className?: string;
  /** Additional CSS class when in disabled mode */
  disabledClassName?: string;
  /** Tooltip text to show (especially useful in disable mode) */
  tooltip?: string;
}

/**
 * Permission check hook props
 *
 * Options for the usePermissionCheck hook to verify access rights.
 */
export interface PermissionCheckProps {
  /** Role(s) to check */
  roles?: string | string[];
  /** Permission(s) to check */
  permissions?: string | string[];
  /** Require all specified roles */
  requireAllRoles?: boolean;
  /** Require all specified permissions */
  requireAllPermissions?: boolean;
  /** Also validate session validity */
  requireValidSession?: boolean;
}

/**
 * Conditional wrapper props
 *
 * Wraps content with different wrappers based on access rights.
 */
export interface ConditionalWrapperProps {
  /** Content to wrap */
  children: ReactNode;
  /** Role(s) to check */
  roles?: string | string[];
  /** Permission(s) to check */
  permissions?: string | string[];
  /** Require all specified roles */
  requireAllRoles?: boolean;
  /** Require all specified permissions */
  requireAllPermissions?: boolean;
  /** Also validate session validity */
  requireValidSession?: boolean;
  /** Wrapper to apply when access is granted */
  wrapper: (children: ReactNode) => ReactNode;
  /** Optional wrapper when access is denied */
  fallbackWrapper?: (children: ReactNode) => ReactNode;
}

/**
 * Session guard props
 *
 * Protects content requiring an active, valid session.
 */
export interface SessionGuardProps {
  /** Content to protect */
  children: ReactNode;
  /** Fallback content when session is invalid */
  fallback?: ReactNode;
  /** URL to redirect to when session is invalid */
  redirectTo?: string;
  /** Callback when session expires or is invalid */
  onSessionExpired?: () => void;
}

/**
 * AccessManager context type
 *
 * Provides access control methods to consuming components.
 */
export interface AccessManagerContextType {
  /** Current user session */
  user: UserSession | null;
  /** Role to permission mapping */
  rolePermissionMap: RolePermissionMap;
  /** Check if user has specified role(s) */
  hasRole: (role: string | string[]) => boolean;
  /** Check if user has specified permission(s) */
  hasPermission: (permission: string | string[]) => boolean;
  /** Check if user has any of the specified roles */
  hasAnyRole: (roles: string[]) => boolean;
  /** Check if user has all of the specified roles */
  hasAllRoles: (roles: string[]) => boolean;
  /** Check if user has any of the specified permissions */
  hasAnyPermission: (permissions: string[]) => boolean;
  /** Check if user has all of the specified permissions */
  hasAllPermissions: (permissions: string[]) => boolean;
  /** Check if the current session is valid (not expired, user active) */
  isSessionValid: () => boolean;
  /** Get remaining session time in milliseconds, or null if no expiration */
  getSessionTimeRemaining: () => number | null;
  /** Check if session is expiring within threshold (default 5 minutes) */
  isSessionExpiring: (thresholdMinutes?: number) => boolean;
}
