/**
 * Supabase Proxy Helper
 *
 * Lightweight Supabase client and session checking utilities for use in the Next.js proxy.
 * These functions are designed to be fast and optimistic, performing only lightweight
 * validation suitable for the proxy layer.
 *
 * IMPORTANT: The proxy has performance constraints, so these functions should:
 * - Perform minimal, fast checks only
 * - Avoid slow database queries
 * - Use optimistic validation
 */

import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';

/**
 * Create a lightweight Supabase client for proxy use
 *
 * This client is configured for read-only session validation in the proxy.
 * It uses the same cookie handling as the main Supabase client but is
 * optimized for the proxy's performance requirements.
 *
 * @param request - The incoming Next.js request
 * @returns A Supabase server client
 */
export function createProxySupabaseClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Proxy doesn't set cookies - that's handled by updateSession
          // This is a read-only client for session checking
        },
      },
    }
  );
}

/**
 * Check if user has a valid session (optimistic check)
 *
 * This performs a lightweight session validation suitable for the proxy.
 * It checks for the presence of auth tokens and validates their structure,
 * but does not perform full JWT verification or database lookups.
 *
 * IMPORTANT: This is an optimistic check only. Full session validation
 * happens in the updateSession function from @/lib/supabase/proxy.
 *
 * @param request - The incoming Next.js request
 * @returns True if user appears to have a valid session
 */
export async function hasValidSession(request: NextRequest): Promise<boolean> {
  try {
    const supabase = createProxySupabaseClient(request);

    // Get claims validates JWT signatures against your project's public keys
    // This is more secure than getSession() which doesn't revalidate tokens
    const { data, error } = await supabase.auth.getClaims();

    // User is authenticated if claims exist and no error
    // The 'sub' claim is the user ID and is always present in valid JWTs
    return !error && data !== null && data.claims?.sub !== undefined;
  } catch (error) {
    // On any error, assume no session (fail closed)
    return false;
  }
}
