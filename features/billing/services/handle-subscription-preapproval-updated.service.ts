/**
 * Handle Subscription Preapproval Updated Service
 *
 * Updates subscription status when it changes in MercadoPago.
 * Handles: authorized, cancelled, paused statuses.
 * Fetches preapproval data from MercadoPago API if not provided via options.
 *
 * @param preapprovalId - The MercadoPago preapproval ID
 * @param options - Optional dependencies for testing (allows injecting mock data)
 *
 * @example
 * // Production usage (fetches from API):
 * await handleSubscriptionPreapprovalUpdated('mp-preapproval-123');
 *
 * // Testing usage (uses injected data):
 * await handleSubscriptionPreapprovalUpdated('mp-preapproval-123', {
 *   preapprovalData: { id: 'mp-preapproval-123', status: 'authorized', ... }
 * });
 */

import {
  getSubscriptionByMercadopagoIdData,
  updateSubscriptionMercadopagoData,
} from '@/features/billing/data';
import type { HandleSubscriptionPreapprovalUpdatedOptions } from '@/features/billing/types/billing';
import {
  getMercadoPagoPreapproval,
  mapMercadoPagoSubscriptionStatus,
} from '@/features/billing/utils';

export async function handleSubscriptionPreapprovalUpdated(
  preapprovalId: string,
  options: HandleSubscriptionPreapprovalUpdatedOptions = {}
): Promise<void> {
  // Use injected data for testing, or fetch from MercadoPago API
  const preapprovalData =
    options.preapprovalData ?? (await getMercadoPagoPreapproval(preapprovalId));

  // Find the subscription by MercadoPago preapproval ID
  const subscription = await getSubscriptionByMercadopagoIdData(preapprovalId);
  if (!subscription) {
    console.log(
      `[Webhook] subscription_preapproval.updated: Subscription not found for preapproval ${preapprovalId}`
    );
    return;
  }

  // Map the status
  const newStatus = mapMercadoPagoSubscriptionStatus(preapprovalData.status);

  // Update the subscription
  await updateSubscriptionMercadopagoData(subscription.id, {
    mercadopagoPreapprovalId: preapprovalId,
    status: newStatus,
    nextBillingDate: preapprovalData.next_payment_date
      ? new Date(preapprovalData.next_payment_date)
      : undefined,
  });

  console.log(
    `[Webhook] subscription_preapproval.updated: Updated subscription ${subscription.id} to status ${newStatus}`
  );
}
