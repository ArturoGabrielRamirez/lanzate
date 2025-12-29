import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';
import { routing } from './i18n/routing';

/**
 * Next.js Proxy (formerly called middleware) for internationalization and authentication.
 *
 * This proxy runs on every request (except excluded routes via matcher) and:
 * 1. Handles locale detection and routing via next-intl
 * 2. Refreshes the Supabase authentication session
 * 3. Ensures session state is consistent across server and client
 *
 * The proxy chains two middleware functions:
 * 1. next-intl middleware for locale handling
 * 2. Supabase middleware for session management
 *
 * @param request - The incoming Next.js request
 * @returns A response with updated locale routing and authentication cookies
 */

export async function proxy(request: NextRequest) {
  // Step 1: Handle internationalization routing
  const handleI18nRouting = createIntlMiddleware(routing);
  const response = handleI18nRouting(request);
  
  // Step 2: Update Supabase session
  // We need to update the session on the response from the intl middleware
  return await updateSession(request, response);
}

/**
 * Matcher configuration to control which routes the proxy runs on.
 *
 * Excludes:
 * - /_next/static (Next.js static files)
 * - /_next/image (Next.js image optimization)
 * - /favicon.ico (favicon)
 * - Static file extensions (.svg, .png, .jpg, .jpeg, .gif, .webp)
 *
 * Including all other routes ensures locale routing and authentication state are always fresh.
 */
export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
