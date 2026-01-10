/**
 * Subdomain Extraction Utility
 *
 * Extracts subdomain from request hostname for routing purposes.
 * Handles localhost development, production domains, and Vercel preview deployments.
 */

import { type NextRequest } from 'next/server';

import { BASE_DOMAINS, ROOT_DOMAIN } from '@/features/subdomain/constants';

/**
 * Extract subdomain from the request hostname.
 *
 * This function handles:
 * - Localhost development (subdomain.localhost:3000)
 * - Production domains (subdomain.lanzate.com)
 * - Vercel preview deployments (tenant---branch.vercel.app)
 * - Port number stripping
 *
 * @param request - The incoming Next.js request
 * @returns The subdomain string, or null if no subdomain detected
 *
 * @example
 * // localhost development
 * extractSubdomain(req) // 'mystore' from mystore.localhost:3000
 *
 * // production
 * extractSubdomain(req) // 'mystore' from mystore.lanzate.com
 */
export function extractSubdomain(request: NextRequest): string | null {
  const host = request.headers.get('host') || '';
  // Strip port number from hostname
  const hostname = host.split(':')[0];

  // Handle localhost development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Check for subdomain.localhost pattern
    if (hostname.endsWith('.localhost')) {
      const subdomain = hostname.replace('.localhost', '');
      // Ensure subdomain is valid and not a base domain
      if (subdomain && !BASE_DOMAINS.includes(subdomain)) {
        return subdomain;
      }
    }
    // No subdomain for plain localhost
    return null;
  }

  // Handle Vercel preview deployments (tenant---branch.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Handle Vercel main domain (no subdomain)
  if (hostname.endsWith('.vercel.app') && !hostname.includes('---')) {
    return null;
  }

  // Handle production domain: subdomain.lanzate.com or subdomain.lanzate.app
  const rootDomainWithoutPort = ROOT_DOMAIN.split(':')[0];

  // If hostname matches root domain exactly, no subdomain
  if (
    hostname === rootDomainWithoutPort ||
    hostname === `www.${rootDomainWithoutPort}`
  ) {
    return null;
  }

  // Check if hostname ends with the root domain
  if (hostname.endsWith(`.${rootDomainWithoutPort}`)) {
    const subdomain = hostname.replace(`.${rootDomainWithoutPort}`, '');
    // Exclude 'www' as a subdomain
    if (
      subdomain &&
      subdomain !== 'www' &&
      !BASE_DOMAINS.includes(subdomain)
    ) {
      return subdomain;
    }
    return null;
  }

  // No subdomain detected
  return null;
}
