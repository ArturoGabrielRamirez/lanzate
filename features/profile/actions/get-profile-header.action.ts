'use server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';

import type { UserWithStores } from '@/features/auth/types';

/**
 * Get Profile Header Server Action
 *
 * Lightweight action that fetches only the user data needed
 * for the profile header display.
 *
 * @returns ServerResponse with user data or error
 */
export async function getProfileHeaderAction() {
  return actionWrapper<UserWithStores>(async () => {
    const authUser = await getAuthUser();
    if (!authUser) {
      return formatError('User not authenticated');
    }

    const user = await getUserBySupabaseId(authUser.id);
    return formatSuccess('User found', user);
  });
}
