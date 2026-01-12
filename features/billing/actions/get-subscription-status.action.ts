'use server';

/**
 * Get Subscription Status Server Action
 *
 * Fetches the current subscription status including plan type, status,
 * next billing date, MercadoPago ID, and last payment information.
 *
 * Flow:
 * 1. Validate subscriptionId with Yup schema
 * 2. Call service layer for subscription status
 * 3. Return ServerResponse with subscription status
 *
 * @param subscriptionId - The subscription ID to fetch status for
 * @returns ServerResponse with subscription status data
 *
 * @example
 * ```tsx
 * import { getSubscriptionStatusAction } from '@/features/billing/actions/get-subscription-status.action';
 *
 * const result = await getSubscriptionStatusAction(subscriptionId);
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Plan:', result.payload.planType);
 *   console.log('Status:', result.payload.status);
 *   console.log('Next billing:', result.payload.nextBillingDate);
 * }
 * ```
 */

import { subscriptionIdSchema } from '@/features/billing/schemas/billing.schema';
import { getSubscriptionStatus } from '@/features/billing/services';
import type { SubscriptionStatus } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess, formatError } from '@/features/global/utils/format-response';

export async function getSubscriptionStatusAction(
  subscriptionId: string
): Promise<ServerResponse<SubscriptionStatus>> {
  return actionWrapper(async () => {
    // Validate subscription ID
    const validatedSubscriptionId = await subscriptionIdSchema.validate(subscriptionId);

    // Call service layer to get subscription status
    const subscriptionStatus = await getSubscriptionStatus(validatedSubscriptionId);

    // Handle case where subscription is not found
    if (!subscriptionStatus) {
      return formatError('Suscripcion no encontrada');
    }

    return formatSuccess('Estado de suscripcion obtenido exitosamente', subscriptionStatus);
  });
}
