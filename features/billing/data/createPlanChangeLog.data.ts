/**
 * Create Plan Change Log Data Function
 *
 * Pure database operation to insert a new plan change log record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param input - Plan change log creation parameters
 * @returns The created plan change log record
 *
 * @example
 * const log = await createPlanChangeLogData({
 *   subscriptionId: 'sub-123',
 *   previousPlan: 'FREE',
 *   newPlan: 'PRO',
 *   initiatorType: 'OWNER',
 *   initiatorId: 'user-123',
 * });
 */

import type { CreatePlanChangeLogInput } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

import type { PlanChangeLog } from '@prisma/client';

export async function createPlanChangeLogData(
  input: CreatePlanChangeLogInput
): Promise<PlanChangeLog> {
  const planChangeLog = await prisma.planChangeLog.create({
    data: {
      subscriptionId: input.subscriptionId,
      previousPlan: input.previousPlan,
      newPlan: input.newPlan,
      changedAt: new Date(),
      initiatorType: input.initiatorType,
      initiatorId: input.initiatorId,
    },
  });

  return planChangeLog;
}
