import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client for use in Client Components.
 *
 * This client is designed to be used in the browser environment and handles
 * authentication state automatically via local storage.
 *
 * Unlike the server client, this can be safely stored in a variable or React state
 * since it runs in the browser context.
 *
 * @returns A Supabase client configured for browser-side use
 *
 * @example
 * // In a Client Component
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 *
 * export function MyComponent() {
 *   const supabase = createClient()
 *
 *   async function signIn() {
 *     await supabase.auth.signInWithPassword({
 *       email: 'user@example.com',
 *       password: 'password'
 *     })
 *   }
 *
 *   return <button onClick={signIn}>Sign In</button>
 * }
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
