'use server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Get Current User Server Action
 *
 * Fetches the current authenticated user from both Supabase Auth
 * and the database, returning complete user information.
 *
 * Flow:
 * 1. Get current Supabase auth user
 * 2. Fetch database user record by Supabase ID
 * 3. Return both auth user and database user data
 *
 * @returns ServerResponse with auth user and database user data
 *
 * @example
 * ```tsx
 * import { getCurrentUserAction } from '@/features/auth/actions/getCurrentUser.action';
 *
 * const result = await getCurrentUserAction();
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Auth User:', result.payload.authUser);
 *   console.log('Database User:', result.payload.user);
 * }
 * ```
 */
export async function getCurrentUserAction() {
  return actionWrapper(async () => {
    // Create Supabase client
    const supabase = await createClient();

    // Get current auth user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error('No authenticated user found');
    }

    // Fetch database user record by Supabase ID
    const dbUser = await getUserBySupabaseId(authUser.id);

    // Return success response with both auth user and database user
    return formatSuccess('User retrieved successfully', {
      authUser,
      user: dbUser,
    });
  });
}
