'use server';

import { createClient } from '@/lib/supabase/server';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess, formatError } from '@/features/global/utils/format-response';
import { getUserDashboardData } from '@/features/dashboard/data/get-user-dashboard-data.data';

/**
 * Get Dashboard Data Server Action
 *
 * Fetches the current authenticated user's dashboard data including:
 * - User information from Supabase
 * - User database record
 * - User's stores
 *
 * This action:
 * - Checks authentication via Supabase
 * - Returns user metadata and database information
 * - Handles cases where user doesn't exist in database
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
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return formatError('User not authenticated');
    }

    // Fetch user data from database
    const userData = await getUserDashboardData(user.id);

    // Prepare response data
    const userName = user.user_metadata?.name || user.user_metadata?.full_name || null;
    const userEmail = user.email || 'User';
    const storesCount = userData?.stores?.length || 0;

    return formatSuccess('Dashboard data fetched successfully', {
      userName,
      userEmail,
      storesCount,
      userExists: !!userData,
    });
  });
}
