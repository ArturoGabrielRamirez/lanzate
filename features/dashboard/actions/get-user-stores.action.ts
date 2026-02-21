'use server';

import {
  DASHBOARD_ERROR_MESSAGES,
  DASHBOARD_SUCCESS_MESSAGES,
  DASHBOARD_STORE_LIMIT,
} from '@/features/dashboard/constants';
import { getUserStoresData } from '@/features/dashboard/data/get-user-stores.data';
import type { UserStoresData } from '@/features/dashboard/types';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { DEFAULT_ACCOUNT_TYPE } from '@/features/subscriptions/config';
import { createClient } from '@/lib/supabase/server';

/**
 * Get User Stores Server Action
 *
 * Fetches the current authenticated user's stores for the dashboard.
 * Returns limited stores for display plus total count.
 *
 * Flow:
 * 1. Check authentication via Supabase
 * 2. Validate user is authenticated
 * 3. Fetch user stores from database via getUserStoresData
 * 4. Return stores list with account type and total count
 *
 * @param limit - Optional limit for number of stores. Defaults to DASHBOARD_STORE_LIMIT (2).
 *                Pass undefined to fetch all stores.
 * @returns ServerResponse with stores, account type, and total count
 *
 * @example
 * ```tsx
 * const result = await getUserStoresAction();
 * if (!result.hasError && result.payload) {
 *   console.log('Stores:', result.payload.stores);
 *   console.log('Account type:', result.payload.accountType);
 * }
 * ```
 */
export async function getUserStoresAction(
  limit: number | undefined = DASHBOARD_STORE_LIMIT
): Promise<ServerResponse<UserStoresData>> {
  return actionWrapper(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(DASHBOARD_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const data = await getUserStoresData(user.id, limit);

    if (!data) {
      return formatSuccess(DASHBOARD_SUCCESS_MESSAGES.NO_STORES, {
        stores: [],
        accountType: DEFAULT_ACCOUNT_TYPE,
        totalCount: 0,
      });
    }

    return formatSuccess(DASHBOARD_SUCCESS_MESSAGES.STORES_FETCHED, data);
  });
}
