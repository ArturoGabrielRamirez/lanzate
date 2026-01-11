/**
 * Get Plan Change Logs By Subscription Data Function
 *
 * Pure database operation to retrieve all plan change logs for a subscription.
 * Does NOT contain business logic - only database interaction.
 *
 * @param subscriptionId - The subscription ID
 * @returns Array of plan change log records ordered by date descending
 *
 * @example
 * const logs = await getPlanChangeLogsBySubscriptionData('sub-123');
 */

import { prisma } from '@/lib/prisma';

import type { PlanChangeLog } from '@prisma/client';

export async function getPlanChangeLogsBySubscriptionData(
  subscriptionId: string
): Promise<PlanChangeLog[]> {
  const logs = await prisma.planChangeLog.findMany({
    where: { subscriptionId },
    orderBy: { changedAt: 'desc' },
  });

  return logs;
}
