/**
 * Subdomain Routing Exclusion Utility
 *
 * Determines which paths should be excluded from subdomain routing.
 * Used by the Next.js proxy middleware.
 */

/**
 * Patterns for paths that should be excluded from subdomain routing.
 *
 * Excludes:
 * - API routes (/api/*)
 * - Next.js internals (/_next/*)
 * - Auth callback routes (/auth/callback)
 * - Static files (favicon.ico, images, etc.)
 * - Already rewritten storefront routes (/s/*)
 */
const EXCLUDED_PATTERNS = [
  /^\/api\//,                              // API routes
  /^\/_next\//,                            // Next.js internals
  /^\/auth\//,                             // Auth routes (callback, etc.)
  /^\/favicon\.ico$/,                      // Favicon
  /^\/s\//,                                // Already rewritten storefront routes
  /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/i, // Static files
];

/**
 * Check if a path should be excluded from subdomain routing.
 *
 * @param pathname - The request pathname
 * @returns True if the path should be excluded from subdomain routing
 *
 * @example
 * shouldExcludeFromSubdomainRouting('/api/stores') // true
 * shouldExcludeFromSubdomainRouting('/_next/static/main.js') // true
 * shouldExcludeFromSubdomainRouting('/products') // false
 */
export function shouldExcludeFromSubdomainRouting(pathname: string): boolean {
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(pathname));
}
