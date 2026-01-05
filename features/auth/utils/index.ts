/**
 * Auth Utilities
 *
 * Exports all authentication utility functions.
 */
export { generateUsername } from '@/features/auth/utils/generateUsername';
export { getAuthUser } from '@/features/auth/utils/getAuthUser';
export { getAuthSession } from '@/features/auth/utils/getAuthSession';
export {
  isProtectedRoute,
  isAuthRoute,
  isPublicRoute,
  getPathnameWithoutLocale,
} from '@/features/auth/utils/routeGuards';
export {
  createProxySupabaseClient,
  hasValidSession,
} from '@/features/auth/utils/supabaseProxy';
