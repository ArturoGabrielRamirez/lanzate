/**
 * Route Constants
 *
 * Defines route paths and categories for authentication-based route protection.
 * Used by the Next.js proxy and route guard utilities.
 */

/**
 * Routes that require authentication
 * Users must be logged in to access these routes
 */
export const PROTECTED_ROUTES = ['/dashboard', '/profile'];

/**
 * Routes that are only for unauthenticated users
 * Authenticated users will be redirected away from these routes
 */
export const AUTH_ROUTES = ['/login', '/signup'];

/**
 * Routes that are accessible to everyone
 * No authentication required
 */
export const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/help',
  '/terms-and-conditions',
  '/privacy-policy',
  '/cookies',
  '/reset-password',
];
