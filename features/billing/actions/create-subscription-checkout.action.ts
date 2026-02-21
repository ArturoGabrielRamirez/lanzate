'use server';

import { BILLING_ERROR_MESSAGES, BILLING_SUCCESS_MESSAGES } from '@/features/billing/constants';
import { createSubscriptionCheckout } from '@/features/billing/services/createSubscriptionCheckout.service';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { isPaidPlan, type PaidPlan } from '@/features/subscriptions/config';
import { createClient } from '@/lib/supabase/server';

/**
 * Create Subscription Checkout Server Action
 *
 * Creates a MercadoPago PreApproval (subscription) and returns the checkout URL
 * where the user will be redirected to complete payment.
 *
 * Flow:
 * 1. Validate target plan is valid (PRO or ENTERPRISE)
 * 2. Get current authenticated user from Supabase
 * 3. Call service to create MercadoPago PreApproval
 * 4. Return checkout URL
 *
 * @param targetPlan - The plan to upgrade to (PRO or ENTERPRISE)
 * @returns ServerResponse with the MercadoPago checkout URL
 *
 * @example
 * ```tsx
 * const result = await createSubscriptionCheckoutAction('PRO');
 * if (!result.hasError && result.payload) {
 *   window.location.href = result.payload; // Redirect to MercadoPago
 * }
 * ```
 */
export async function createSubscriptionCheckoutAction(
  targetPlan: PaidPlan
): Promise<ServerResponse<string>> {
  return actionWrapper(async () => {
    if (!isPaidPlan(targetPlan)) {
      throw new Error(BILLING_ERROR_MESSAGES.PLAN_INVALID);
    }

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      throw new Error(BILLING_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const checkoutUrl = await createSubscriptionCheckout(targetPlan, user.email);

    return formatSuccess(BILLING_SUCCESS_MESSAGES.CHECKOUT_CREATED, checkoutUrl);
  });
}
