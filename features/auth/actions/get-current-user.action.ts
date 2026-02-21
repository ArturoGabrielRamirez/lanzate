'use server';

import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
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
    const supabase = await createClient();

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error(AUTH_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const dbUser = await getUserBySupabaseId(authUser.id);

    return formatSuccess(AUTH_SUCCESS_MESSAGES.PROFILE_UPDATE, {
      authUser,
      user: dbUser,
    });
  });
}
