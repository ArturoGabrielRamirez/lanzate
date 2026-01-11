/**
 * Get Subscription By User Email Data Function
 *
 * Pure database operation to retrieve a subscription by user's email.
 * Does NOT contain business logic - only database interaction.
 *
 * @param email - The user's email address
 * @returns The subscription record or null if not found
 *
 * @example
 * const subscription = await getSubscriptionByUserEmailData('user@example.com');
 */

import { prisma } from '@/lib/prisma';

import type { Subscription } from '@prisma/client';

export async function getSubscriptionByUserEmailData(
  email: string
): Promise<Subscription | null> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      user: {
        email,
      },
    },
  });

  return subscription;
}
