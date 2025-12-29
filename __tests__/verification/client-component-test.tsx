'use client'

/**
 * Client Component verification for Supabase client
 *
 * This component demonstrates that the browser-side Supabase client
 * can be used in a Client Component without errors.
 *
 * Note: This is for verification purposes only. Actual auth implementation
 * is deferred to the Authentication spec.
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ClientComponentTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function testClient() {
      try {
        // Create Supabase browser client
        const supabase = createClient()

        // Attempt to get user (will return null if not authenticated)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setUserEmail(user?.email || null)
        setStatus('success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setStatus('error')
      }
    }

    testClient()
  }, [])

  if (status === 'loading') {
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          Client Component - Supabase Client Test
        </h2>
        <p className="text-sm text-gray-600">Initializing client...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="p-4 border border-red-500 rounded-lg">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Client Component - Error
        </h2>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-2">
        Client Component - Supabase Client Test
      </h2>
      <div className="space-y-2">
        <p className="text-sm">
          <strong>Status:</strong>{' '}
          <span className="text-green-600">Client initialized successfully</span>
        </p>
        <p className="text-sm">
          <strong>Authentication:</strong>{' '}
          {userEmail ? (
            <span className="text-green-600">Authenticated ({userEmail})</span>
          ) : (
            <span className="text-gray-600">Not authenticated (expected)</span>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          This verifies that the Supabase browser client can be used in Client
          Components without errors.
        </p>
      </div>
    </div>
  )
}
