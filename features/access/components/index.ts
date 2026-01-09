export {
  AccessGate,
  AccessManagerProvider,
  usePermissionCheck,
  useAccessManager,
  useRoleBasedAccess,
  ConditionalWrapper,
  SessionGuard,
  RoleBasedAccessProvider,
  RoleGate,
  RoleBasedAccess,
} from '@/features/access/components/gate'

export type {
  UserSession,
  RolePermissionMap,
  AccessManagerContextType,
  AccessManagerProviderProps,
  AccessGateProps,
  PermissionCheckProps,
  ConditionalWrapperProps,
  SessionGuardProps,
} from '@/features/access/components/gate'
