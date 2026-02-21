/**
 * Get Subscription Status Service
 *
 * Contains business logic for transforming subscription data into the
 * SubscriptionStatus response format.
 *
 * @param subscriptionId - The subscription ID
 * @returns The subscription status or null if not found
 *
 * @example
 * const status = await getSubscriptionStatus('sub-123');
 */

import { getSubscriptionWithLastPaymentData } from '@/features/billing/data';
import type {
  SubscriptionStatus,
  LastPaymentInfo,
} from '@/features/billing/types/billing';

export async function getSubscriptionStatus(
  subscriptionId: string
): Promise<SubscriptionStatus | null> {
  // Call data layer to fetch subscription with last payment
  const subscription = await getSubscriptionWithLastPaymentData(subscriptionId);

  // Handle case where subscription is not found
  if (!subscription) {
    return null;
  }

  // Transform last payment data if available
  let lastPayment: LastPaymentInfo | null = null;
  if (subscription.payments.length > 0) {
    const payment = subscription.payments[0];
    lastPayment = {
      amount: Number(payment.amount),
      status: payment.status,
      paidAt: payment.paidAt,
    };
  }

  // Build subscription status response
  const subscriptionStatus: SubscriptionStatus = {
    planType: subscription.accountType,
    status: subscription.status,
    nextBillingDate: subscription.nextBillingDate,
    mercadopagoId: subscription.mercadopagoPreapprovalId,
    lastPayment,
  };

  return subscriptionStatus;
}
