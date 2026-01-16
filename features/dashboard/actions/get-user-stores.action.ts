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
import { DEFAULT_ACCOUNT_TYPE } from '@/features/subscriptions/config';
import { createClient } from '@/lib/supabase/server';

const DASHBOARD_STORE_LIMIT = 2;

/**
 * Get User Stores Server Action
 *
 * @param limit - Optional limit for number of stores. Defaults to DASHBOARD_STORE_LIMIT (2).
 *                Pass undefined to fetch all stores.
 */
export async function getUserStoresAction(
  limit: number | undefined = DASHBOARD_STORE_LIMIT
): Promise<ServerResponse<UserStoresData>> {
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
    const data = await getUserStoresData(user.id, limit);

    if (!data) {
      return formatSuccess('No stores found', {
        stores: [],
        accountType: DEFAULT_ACCOUNT_TYPE,
        totalCount: 0,
      });
    }

    return formatSuccess('Stores fetched successfully', data);
  });
}
