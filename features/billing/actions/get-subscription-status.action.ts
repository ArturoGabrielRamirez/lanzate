'use server';

import { BILLING_ERROR_MESSAGES, BILLING_SUCCESS_MESSAGES } from '@/features/billing/constants';
import { subscriptionIdSchema } from '@/features/billing/schemas/billing.schema';
import { getSubscriptionStatus } from '@/features/billing/services';
import type { SubscriptionStatus } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';

/**
 * Get Subscription Status Server Action
 *
 * Fetches the current subscription status including plan type, status,
 * next billing date, MercadoPago ID, and last payment information.
 *
 * Flow:
 * 1. Validate subscriptionId with Yup schema
 * 2. Call service layer for subscription status
 * 3. Validate subscription was found
 * 4. Return ServerResponse with subscription status
 *
 * @param subscriptionId - The subscription ID to fetch status for
 * @returns ServerResponse with subscription status data
 *
 * @example
 * ```tsx
 * const result = await getSubscriptionStatusAction(subscriptionId);
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Plan:', result.payload.planType);
 *   console.log('Status:', result.payload.status);
 *   console.log('Next billing:', result.payload.nextBillingDate);
 * }
 * ```
 */
export async function getSubscriptionStatusAction(
  subscriptionId: string
): Promise<ServerResponse<SubscriptionStatus>> {
  return actionWrapper(async () => {
    const validatedSubscriptionId = await subscriptionIdSchema.validate(subscriptionId);

    const subscriptionStatus = await getSubscriptionStatus(validatedSubscriptionId);

    if (!subscriptionStatus) {
      throw new Error(BILLING_ERROR_MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    return formatSuccess(BILLING_SUCCESS_MESSAGES.SUBSCRIPTION_STATUS_FETCHED, subscriptionStatus);
  });
}
