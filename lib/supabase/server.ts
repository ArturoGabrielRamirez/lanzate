import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase server client for use in Server Components and Server Actions.
 *
 * Important: Do not store this client in a global variable when using Fluid compute.
 * Always create a new client within each function that needs it.
 *
 * This client handles session management via cookies, which are automatically
 * refreshed by the middleware (see middleware.ts).
 *
 * @returns A Supabase client configured for server-side use
 *
 * @example
 * // In a Server Component
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 *
 * @example
 * // In a Server Action
 * 'use server'
 * async function myAction() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('users').select('*')
 *   return data
 * }
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
