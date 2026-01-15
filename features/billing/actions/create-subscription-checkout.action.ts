'use server';

/**
 * Create Subscription Checkout Server Action
 *
 * Creates a MercadoPago PreApproval (subscription) and returns the checkout URL
 * where the user will be redirected to complete payment.
 *
 * Flow:
 * 1. Validate target plan is valid (PRO or ENTERPRISE)
 * 2. Get current authenticated user
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

import { createSubscriptionCheckout } from '@/features/billing/services/createSubscriptionCheckout.service';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess, formatError } from '@/features/global/utils/format-response';
import { isPaidPlan, type PaidPlan } from '@/features/subscriptions/config';
import { createClient } from '@/lib/supabase/server';

export async function createSubscriptionCheckoutAction(
  targetPlan: PaidPlan
): Promise<ServerResponse<string>> {
  return actionWrapper(async () => {
    // Validate target plan is a paid plan
    if (!isPaidPlan(targetPlan)) {
      return formatError('Plan inválido. Debe ser PRO o ENTERPRISE.');
    }

    // Get current authenticated user
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return formatError('Usuario no autenticado');
    }

    // Create MercadoPago checkout
    const checkoutUrl = await createSubscriptionCheckout(targetPlan, user.email);

    return formatSuccess('Checkout creado exitosamente', checkoutUrl);
  });
}
