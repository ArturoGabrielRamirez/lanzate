import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Updates the Supabase session for server-side requests.
 *
 * This function is called from the Next.js proxy (proxy.ts) and handles:
 * 1. Refreshing authentication tokens by calling supabase.auth.getClaims()
 * 2. Setting refreshed tokens in request cookies
 * 3. Passing updated tokens to the browser via response cookies
 *
 * This is required because Next.js Server Components cannot write cookies directly.
 * The proxy ensures that authentication state is consistent across all server requests.
 *
 * @param request - The incoming Next.js request
 * @param response - Optional NextResponse from previous middleware (e.g., from next-intl)
 * @returns A NextResponse with updated session cookies
 *
 * @example
 * // In proxy.ts
 * import { updateSession } from '@/lib/supabase/proxy'
 *
 * export async function proxy(request: NextRequest) {
 *   return await updateSession(request)
 * }
 */
export async function updateSession(
  request: NextRequest,
  response?: NextResponse
) {
  // Use provided response or create a new one
  const supabaseResponse = response || NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refresh session if expired - required for Server Components
  // getClaims() validates JWT signatures against your project's public keys
  // This is more secure than getSession() which doesn't revalidate tokens
  await supabase.auth.getClaims()

  return supabaseResponse
}
