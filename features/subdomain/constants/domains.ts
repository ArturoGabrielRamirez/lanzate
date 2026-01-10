/**
 * Domain Constants
 *
 * Defines domain-related constants for subdomain routing.
 * Used by the Next.js proxy middleware for subdomain detection.
 */

/**
 * Base domains that should not be treated as subdomains.
 * These are the root domains where the application is hosted.
 */
export const BASE_DOMAINS = [
  'localhost',
  'lanzate.com',
  'lanzate.app',
  'vercel.app',
];

/**
 * Root domain for the application.
 * Defaults to 'lanzate.app' in production.
 */
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app';
