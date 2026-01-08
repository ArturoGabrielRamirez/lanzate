/**
 * Get User Subscription Data Function
 *
 * Pure database operation to retrieve a user's subscription record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param userId - The ID of the user whose subscription to retrieve
 * @returns The subscription record for the user, or null if not found
 *
 * @example
 * const subscription = await getUserSubscriptionData('user-id-123');
 * if (subscription) {
 *   console.log(`User has ${subscription.accountType} account`);
 * } else {
 *   console.log('User has no subscription');
 * }
 */
import { prisma } from '@/lib/prisma';

import type { Subscription } from '@prisma/client';

export async function getUserSubscriptionData(
  userId: string
): Promise<Subscription | null> {
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId,
    },
  });

  return subscription;
}
