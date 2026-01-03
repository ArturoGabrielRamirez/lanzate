/**
 * Get Auth Session Utility
 *
 * Retrieves the current Supabase authentication session.
 *
 * @returns The current Supabase session or null if not authenticated
 *
 * @example
 * const session = await getAuthSession();
 * if (session) {
 *   console.log('Access Token:', session.access_token);
 * }
 */
import { createClient } from '@/lib/supabase/server';

export async function getAuthSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
