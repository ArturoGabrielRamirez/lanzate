'use server';

import { requireAuth } from '@/features/auth/utils';
import { BILLING_ERROR_MESSAGES, BILLING_SUCCESS_MESSAGES } from '@/features/billing/constants';
import { getUserSubscriptionStatus } from '@/features/billing/services';
import type { SubscriptionStatus } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';

/**
 * Get User Subscription Status Server Action
 *
 * Fetches the current authenticated user's subscription status including
 * plan type, status, next billing date, MercadoPago ID, and last payment.
 *
 * Flow:
 * 1. Get current authenticated user from Supabase
 * 2. Validate user is authenticated
 * 3. Call service layer for user subscription status
 * 4. Return ServerResponse with subscription status
 *
 * @returns ServerResponse with subscription status data
 *
 * @example
 * ```tsx
 * const result = await getUserSubscriptionStatusAction();
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Plan:', result.payload.planType);
 *   console.log('Status:', result.payload.status);
 *   console.log('Next billing:', result.payload.nextBillingDate);
 * }
 * ```
 */
export async function getUserSubscriptionStatusAction(): Promise<ServerResponse<SubscriptionStatus>> {
  return actionWrapper(async () => {
    const { authUser: user } = await requireAuth(BILLING_ERROR_MESSAGES.NOT_AUTHENTICATED);

    const subscriptionStatus = await getUserSubscriptionStatus(user.email || '');

    return formatSuccess(BILLING_SUCCESS_MESSAGES.SUBSCRIPTION_STATUS_FETCHED, subscriptionStatus);
  });
}
