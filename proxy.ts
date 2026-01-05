import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

import {
  isProtectedRoute,
  isAuthRoute,
  getPathnameWithoutLocale,
} from '@/features/auth/utils/routeGuards';
import { hasValidSession } from '@/features/auth/utils/supabaseProxy';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/proxy';

/**
 * Next.js Proxy (formerly called middleware) for internationalization and authentication.
 *
 * This proxy runs on every request (except excluded routes via matcher) and:
 * 1. Handles locale detection and routing via next-intl
 * 2. Refreshes the Supabase authentication session
 * 3. Protects routes based on authentication status
 * 4. Redirects authenticated users away from login/signup
 * 5. Redirects unauthenticated users away from protected routes
 *
 * The proxy chains multiple middleware functions:
 * 1. next-intl middleware for locale handling
 * 2. Supabase middleware for session management
 * 3. Route protection logic based on authentication state
 *
 * @param request - The incoming Next.js request
 * @returns A response with updated locale routing, authentication cookies, and redirects
 */
export async function proxy(request: NextRequest) {
  // Step 1: Handle internationalization routing
  const handleI18nRouting = createIntlMiddleware(routing);
  const intlResponse = handleI18nRouting(request);

  // Step 2: Update Supabase session
  // We need to update the session on the response from the intl middleware
  const sessionResponse = await updateSession(request, intlResponse);

  // Step 3: Route protection based on authentication
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  // Check authentication status (optimistic check)
  const isAuthenticated = await hasValidSession(request);

  // Get the current locale from the pathname or use default
  const localeMatch = pathname.match(/^\/([a-z]{2})\//);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute(pathnameWithoutLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedRoute(pathnameWithoutLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    // Optionally add callbackUrl for post-login redirect
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Allow request to proceed
  return sessionResponse;
}

/**
 * Matcher configuration to control which routes the proxy runs on.
 *
 * Excludes:
 * - /_next/static (Next.js static files)
 * - /_next/image (Next.js image optimization)
 * - /favicon.ico (favicon)
 * - /api/* (API routes)
 * - /auth/callback (OAuth callback - needs special handling)
 * - Static file extensions (.svg, .png, .jpg, .jpeg, .gif, .webp)
 *
 * Including all other routes ensures locale routing, authentication state,
 * and route protection are always enforced.
 */
export const config = {
  matcher: [
    // Match all routes except static files, API routes, and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
