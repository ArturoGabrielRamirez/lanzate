'use server';

import { getUserBySupabaseId } from '@/features/auth/data';
import type { UserWithStores } from '@/features/auth/types';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PROFILE_ERROR_MESSAGES, PROFILE_SUCCESS_MESSAGES } from '@/features/profile/constants';

/**
 * Get Profile Header Server Action
 *
 * Lightweight action that fetches only the user data needed
 * for the profile header display.
 *
 * Flow:
 * 1. Get current authenticated user via getAuthUser
 * 2. Validate user is authenticated
 * 3. Fetch database user record by Supabase ID
 * 4. Return user data for profile header
 *
 * @returns ServerResponse with user data or error
 *
 * @example
 * ```tsx
 * const result = await getProfileHeaderAction();
 * if (!result.hasError && result.payload) {
 *   console.log('User:', result.payload.username);
 * }
 * ```
 */
export async function getProfileHeaderAction() {
  return actionWrapper<UserWithStores>(async () => {
    const authUser = await getAuthUser();

    if (!authUser) {
      throw new Error(PROFILE_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const user = await getUserBySupabaseId(authUser.id);

    return formatSuccess(PROFILE_SUCCESS_MESSAGES.HEADER_FETCHED, user);
  });
}
