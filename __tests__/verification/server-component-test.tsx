/**
 * Server Component verification for Supabase client
 *
 * This component demonstrates that the server-side Supabase client
 * can be used in a Server Component without errors.
 *
 * Note: This is for verification purposes only. Actual auth implementation
 * is deferred to the Authentication spec.
 */

import { createClient } from '@/lib/supabase/server'

export default async function ServerComponentTest() {
  try {
    // Create Supabase server client
    const supabase = await createClient()

    // Attempt to get user (will return null if not authenticated)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          Server Component - Supabase Client Test
        </h2>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Status:</strong>{' '}
            <span className="text-green-600">Client initialized successfully</span>
          </p>
          <p className="text-sm">
            <strong>Authentication:</strong>{' '}
            {user ? (
              <span className="text-green-600">Authenticated ({user.email})</span>
            ) : (
              <span className="text-gray-600">Not authenticated (expected)</span>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This verifies that the Supabase server client can be used in Server
            Components without errors.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-4 border border-red-500 rounded-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Server Component - Error
        </h2>
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </p>
      </div>
    )
  }
}
