/**
 * Get Subscription With Last Payment Data Function
 *
 * Pure database operation to retrieve a subscription with its most recent payment.
 * Does NOT contain business logic - only database interaction.
 *
 * @param subscriptionId - The subscription ID
 * @returns The subscription with last payment or null if not found
 *
 * @example
 * const subscription = await getSubscriptionWithLastPaymentData('sub-123');
 */

import type { SubscriptionWithLastPayment } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

export async function getSubscriptionWithLastPaymentData(
  subscriptionId: string
): Promise<SubscriptionWithLastPayment | null> {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  return subscription;
}
