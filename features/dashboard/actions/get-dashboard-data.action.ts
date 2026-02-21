'use server';

import { AccountType } from '@prisma/client';

import { requireAuth } from '@/features/auth/utils';
import { DASHBOARD_ERROR_MESSAGES, DASHBOARD_SUCCESS_MESSAGES } from '@/features/dashboard/constants';
import { getUserDashboardData } from '@/features/dashboard/data/get-user-dashboard-data.data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getUserSubscriptionData } from '@/features/subscriptions/data';

/**
 * Get Dashboard Data Server Action
 *
 * Fetches the current authenticated user's dashboard data including:
 * - User information from Supabase
 * - User database record
 * - User's stores count
 * - User's account type from their subscription
 *
 * Flow:
 * 1. Check authentication via Supabase
 * 2. Fetch user database record via getUserDashboardData
 * 3. Fetch subscription to determine account type
 * 4. Return combined user metadata and stores count
 *
 * @returns ServerResponse with user data and stores count
 *
 * @example
 * ```tsx
 * const result = await getDashboardDataAction();
 * if (!result.hasError) {
 *   console.log(result.payload.userName);
 *   console.log(result.payload.storesCount);
 * }
 * ```
 */
export async function getDashboardDataAction() {
  return actionWrapper(async () => {
    const { authUser: user } = await requireAuth(DASHBOARD_ERROR_MESSAGES.NOT_AUTHENTICATED);

    const userData = await getUserDashboardData(user.id);

    const subscription = await getUserSubscriptionData(user.id);
    const accountType = subscription?.accountType ?? AccountType.FREE;

    const userName = user.user_metadata?.name || user.user_metadata?.full_name || null;
    const userEmail = user.email || 'User';
    const storesCount = userData?.stores?.length || 0;

    return formatSuccess(DASHBOARD_SUCCESS_MESSAGES.DATA_FETCHED, {
      userName,
      userEmail,
      storesCount,
      accountType,
      userExists: !!userData,
    });
  });
}
