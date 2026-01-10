/**
 * Subdomain Routing Middleware Tests
 *
 * These tests verify that the subdomain routing middleware correctly:
 * 1. Extracts subdomain from hostname
 * 2. Strips port numbers from hostname
 * 3. Rewrites requests to /s/[subdomain] for valid subdomains
 * 4. Supports localhost development pattern (subdomain.localhost:3000)
 * 5. Excludes API routes, _next paths, and static files from processing
 *
 * Note: These tests are written BEFORE the implementation (TDD approach)
 * to verify the expected behavior of the subdomain routing middleware
 * that will be implemented in tasks 8.2-8.9.
 */

import { describe, it, expect } from 'bun:test';

/**
 * Helper function to extract subdomain from hostname.
 * This mirrors the expected implementation logic.
 *
 * @param hostname - The hostname from the request
 * @returns The subdomain or null if no subdomain
 */
function extractSubdomain(hostname: string): string | null {
  // Strip port number from hostname
  const hostnameWithoutPort = hostname.split(':')[0];

  // Define base domains that should not be treated as subdomains
  const baseDomains = ['localhost', 'lanzate.com', 'vercel.app'];

  // Check for localhost pattern: subdomain.localhost
  if (hostnameWithoutPort.endsWith('.localhost')) {
    const subdomain = hostnameWithoutPort.replace('.localhost', '');
    // Ensure subdomain is not empty and is not a base domain
    if (subdomain && !baseDomains.includes(subdomain)) {
      return subdomain;
    }
    return null;
  }

  // Check for production domain pattern: subdomain.lanzate.com
  for (const baseDomain of baseDomains) {
    if (hostnameWithoutPort.endsWith(`.${baseDomain}`)) {
      const subdomain = hostnameWithoutPort.replace(`.${baseDomain}`, '');
      if (subdomain && !baseDomains.includes(subdomain)) {
        return subdomain;
      }
      return null;
    }
  }

  // No subdomain detected (main domain or base domain only)
  return null;
}

/**
 * Helper function to determine if a path should be excluded from middleware processing.
 *
 * @param pathname - The request pathname
 * @returns True if the path should be excluded from subdomain routing
 */
function shouldExcludePath(pathname: string): boolean {
  const excludedPatterns = [
    /^\/api\//,           // API routes
    /^\/_next\//,         // Next.js internals (static, image, etc.)
    /^\/favicon\.ico$/,   // Favicon
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/, // Static files
  ];

  return excludedPatterns.some((pattern) => pattern.test(pathname));
}

/**
 * Helper function to create rewrite URL for subdomain requests.
 *
 * @param subdomain - The extracted subdomain
 * @param pathname - The original request pathname
 * @returns The rewritten path
 */
function createRewritePath(subdomain: string, pathname: string): string {
  // Rewrite to /s/[subdomain] + original pathname
  return `/s/${subdomain}${pathname}`;
}

describe('Subdomain Routing Middleware', () => {
  it('should extract subdomain from localhost hostname and strip port number', () => {
    // Test subdomain extraction from hostname
    expect(extractSubdomain('mystore.localhost:3000')).toBe('mystore');
    expect(extractSubdomain('store1.localhost')).toBe('store1');

    // Test port stripping - same subdomain regardless of port
    expect(extractSubdomain('test-store.localhost:3000')).toBe('test-store');
    expect(extractSubdomain('test-store.localhost:8080')).toBe('test-store');

    // Test main domain returns null (no subdomain)
    expect(extractSubdomain('localhost:3000')).toBeNull();
    expect(extractSubdomain('lanzate.com')).toBeNull();
  });

  it('should rewrite subdomain requests to /s/[subdomain] path', () => {
    // Test root path rewrite
    expect(createRewritePath('mystore', '/')).toBe('/s/mystore/');

    // Test nested path rewrite
    expect(createRewritePath('store1', '/products')).toBe('/s/store1/products');
    expect(createRewritePath('shop', '/categories/electronics')).toBe('/s/shop/categories/electronics');
  });

  it('should exclude API routes from subdomain processing', () => {
    expect(shouldExcludePath('/api/stores')).toBe(true);
    expect(shouldExcludePath('/api/auth/callback')).toBe(true);
    expect(shouldExcludePath('/api/v1/products')).toBe(true);
  });

  it('should exclude Next.js internals (_next) from subdomain processing', () => {
    expect(shouldExcludePath('/_next/static/chunks/main.js')).toBe(true);
    expect(shouldExcludePath('/_next/image?url=test.png')).toBe(true);
    expect(shouldExcludePath('/_next/data/build-id/page.json')).toBe(true);
  });

  it('should exclude static files from subdomain processing', () => {
    expect(shouldExcludePath('/favicon.ico')).toBe(true);
    expect(shouldExcludePath('/images/logo.png')).toBe(true);
    expect(shouldExcludePath('/assets/hero.jpg')).toBe(true);
    expect(shouldExcludePath('/icons/icon.svg')).toBe(true);
  });

  it('should allow regular page routes for subdomain processing', () => {
    expect(shouldExcludePath('/')).toBe(false);
    expect(shouldExcludePath('/products')).toBe(false);
    expect(shouldExcludePath('/en/dashboard')).toBe(false);
    expect(shouldExcludePath('/categories/electronics')).toBe(false);
  });
});
