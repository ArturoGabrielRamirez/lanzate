'use server';

/**
 * Get User Subscription Status Server Action
 *
 * Fetches the current authenticated user's subscription status including
 * plan type, status, next billing date, MercadoPago ID, and last payment.
 *
 * Flow:
 * 1. Get current authenticated user from Supabase
 * 2. Call service layer for user subscription status
 * 3. Return ServerResponse with subscription status
 *
 * @returns ServerResponse with subscription status data
 *
 * @example
 * ```tsx
 * import { getUserSubscriptionStatusAction } from '@/features/billing/actions/get-user-subscription-status.action';
 *
 * const result = await getUserSubscriptionStatusAction();
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Plan:', result.payload.planType);
 *   console.log('Status:', result.payload.status);
 *   console.log('Next billing:', result.payload.nextBillingDate);
 * }
 * ```
 */

import { getUserSubscriptionStatus } from '@/features/billing/services';
import type { SubscriptionStatus } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess, formatError } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

export async function getUserSubscriptionStatusAction(): Promise<ServerResponse<SubscriptionStatus>> {
  return actionWrapper(async () => {
    // Get current authenticated user from Supabase
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Handle authentication error
    if (error || !user) {
      return formatError('Usuario no autenticado');
    }

    // Call service layer to get user subscription status
    const subscriptionStatus = await getUserSubscriptionStatus(user.email || '');

    return formatSuccess('Estado de suscripción obtenido exitosamente', subscriptionStatus);
  });
}