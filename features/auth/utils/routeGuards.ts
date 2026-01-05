/**
 * Route Guard Utilities
 *
 * Helper functions to determine route types and access permissions.
 * Used by the Next.js proxy for authentication-based route protection.
 */

import {
  PROTECTED_ROUTES,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
} from '@/features/auth/constants/routes';

/**
 * Check if a route is protected (requires authentication)
 *
 * @param pathname - The pathname to check (without locale prefix)
 * @returns True if the route requires authentication
 *
 * @example
 * isProtectedRoute('/dashboard') // true
 * isProtectedRoute('/dashboard/settings') // true
 * isProtectedRoute('/login') // false
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route is an auth route (login/signup)
 * These routes should redirect authenticated users away
 *
 * @param pathname - The pathname to check (without locale prefix)
 * @returns True if the route is an auth route
 *
 * @example
 * isAuthRoute('/login') // true
 * isAuthRoute('/signup') // true
 * isAuthRoute('/dashboard') // false
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a route is public (accessible to everyone)
 *
 * @param pathname - The pathname to check (without locale prefix)
 * @returns True if the route is public
 *
 * @example
 * isPublicRoute('/') // true
 * isPublicRoute('/about') // true
 * isPublicRoute('/dashboard') // false
 */
export function isPublicRoute(pathname: string): boolean {
  // Exact match for root
  if (pathname === '/') return true;

  // Check if starts with any public route
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Extract pathname without locale prefix
 *
 * @param pathname - The full pathname (e.g., '/en/dashboard')
 * @returns The pathname without locale (e.g., '/dashboard')
 *
 * @example
 * getPathnameWithoutLocale('/en/dashboard') // '/dashboard'
 * getPathnameWithoutLocale('/es/login') // '/login'
 * getPathnameWithoutLocale('/dashboard') // '/dashboard'
 */
export function getPathnameWithoutLocale(pathname: string): string {
  // Match locale pattern: /en, /es, etc.
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/.*)?$/);

  if (localeMatch) {
    // Return path without locale, or '/' if no path after locale
    return localeMatch[2] || '/';
  }

  // No locale prefix found, return as-is
  return pathname;
}
