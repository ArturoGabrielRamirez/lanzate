import { User } from '@supabase/supabase-js';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null | undefined): user is User {
  return !!user;
}

/**
 * Check if the current route is an auth route where navbar links should be hidden
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  
  // Remove locale prefix if present (e.g., /es/login -> /login)
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '');
  
  return authRoutes.some(route => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`));
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(user: User | null | undefined): string {
  if (!user) return '';
  
  const name = user.user_metadata?.full_name || user.email || '';
  return name.charAt(0).toUpperCase();
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return '';
  
  return user.user_metadata?.full_name || user.email || '';
}

