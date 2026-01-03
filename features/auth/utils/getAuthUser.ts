/**
 * Get Auth User Utility
 *
 * Retrieves the current authenticated Supabase user from the session.
 *
 * @returns The current Supabase auth user or null if not authenticated
 *
 * @example
 * const user = await getAuthUser();
 * if (user) {
 *   console.log('User ID:', user.id);
 * }
 */
import { createClient } from '@/lib/supabase/server';

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
