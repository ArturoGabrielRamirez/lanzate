'use server';

/**
 * Get User Stores Server Action
 *
 * Fetches the current authenticated user's stores for the dashboard.
 * Returns limited stores for display plus total count.
 *
 * @returns ServerResponse with stores, account type, and total count
 */

import { getUserStoresData } from '@/features/dashboard/data/get-user-stores.data';
import type { UserStoresData } from '@/features/dashboard/types';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

const DASHBOARD_STORE_LIMIT = 2;

export async function getUserStoresAction(): Promise<ServerResponse<UserStoresData>> {
  return actionWrapper(async () => {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return formatError('User not authenticated');
    }

    // Fetch user stores from database
    const data = await getUserStoresData(user.id, DASHBOARD_STORE_LIMIT);

    if (!data) {
      return formatSuccess('No stores found', {
        stores: [],
        accountType: 'FREE' as const,
        totalCount: 0,
      });
    }

    return formatSuccess('Stores fetched successfully', data);
  });
}
