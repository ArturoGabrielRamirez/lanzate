/**
 * Get User Subscription Status Service
 *
 * Contains business logic for transforming current user's subscription data
 * into the SubscriptionStatus response format.
 *
 * This service handles two cases:
 * 1. User has subscription - returns full subscription status
 * 2. User has no subscription (FREE) - returns default FREE status
 *
 * @param userEmail - The current user's email address
 * @returns The subscription status (never null)
 *
 * @example
 * const status = await getUserSubscriptionStatus('user@example.com');
 * console.log(status.planType); // 'PRO' | 'FREE'
 * console.log(status.status);  // 'AUTHORIZED' | 'PENDING' | etc.
 */

import { getSubscriptionByUserEmailData } from '@/features/billing/data';
import { getSubscriptionStatus } from '@/features/billing/services';
import type { SubscriptionStatus } from '@/features/billing/types/billing';
import { DEFAULT_ACCOUNT_TYPE } from '@/features/subscriptions/config';

export async function getUserSubscriptionStatus(userEmail: string): Promise<SubscriptionStatus> {
  // Search for user's subscription by email
  const subscription = await getSubscriptionByUserEmailData(userEmail);
  
  // Case 1: User has no subscription (FREE user)
  if (!subscription) {
    return {
      planType: DEFAULT_ACCOUNT_TYPE,
      status: 'AUTHORIZED', // FREE users are considered authorized
      nextBillingDate: null,
      mercadopagoId: null,
      lastPayment: null,
    };
  }
  
  // Case 2: User has subscription - reuse existing service logic
  // The existing getSubscriptionStatus handles the transformation to SubscriptionStatus format
  const subscriptionStatus = await getSubscriptionStatus(subscription.id);
  
  // Ensure we never return null - this should not happen if subscription exists
  if (!subscriptionStatus) {
    // Fallback to FREE status if something goes wrong
    return {
      planType: DEFAULT_ACCOUNT_TYPE,
      status: 'AUTHORIZED',
      nextBillingDate: null,
      mercadopagoId: null,
      lastPayment: null,
    };
  }
  
  return subscriptionStatus;
}