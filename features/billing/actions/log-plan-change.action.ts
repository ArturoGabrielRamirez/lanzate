'use server';

import { BILLING_SUCCESS_MESSAGES } from '@/features/billing/constants';
import { createPlanChangeLogData } from '@/features/billing/data';
import { planChangeInputSchema } from '@/features/billing/schemas/billing.schema';
import type { AccountType, InitiatorType, PlanChangeLog } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';

/**
 * Log Plan Change Server Action
 *
 * Records a plan change in the plan change log for audit purposes.
 * This action is designed to be called from existing upgrade/downgrade
 * actions to maintain a history of all plan changes.
 *
 * Flow:
 * 1. Validate all input parameters with Yup schema
 * 2. Call data layer to create plan change log
 * 3. Return ServerResponse with created log
 *
 * @param subscriptionId - The subscription ID where the plan change occurred
 * @param previousPlan - The plan type before the change
 * @param newPlan - The plan type after the change
 * @param initiatorType - Who initiated the change (OWNER, EMPLOYEE, or SYSTEM)
 * @param initiatorId - Optional ID of the user/employee who initiated (null for SYSTEM)
 * @returns ServerResponse with the created plan change log
 *
 * @example
 * ```tsx
 * // Log a plan upgrade initiated by account owner
 * const result = await logPlanChangeAction(
 *   subscriptionId,
 *   'FREE',
 *   'PRO',
 *   'OWNER',
 *   userId
 * );
 *
 * // Log a plan change triggered by webhook (system)
 * const result = await logPlanChangeAction(
 *   subscriptionId,
 *   'PRO',
 *   'ENTERPRISE',
 *   'SYSTEM'
 * );
 *
 * if (!result.hasError && result.payload) {
 *   console.log('Plan change logged:', result.payload.id);
 * }
 * ```
 */
export async function logPlanChangeAction(
  subscriptionId: string,
  previousPlan: AccountType,
  newPlan: AccountType,
  initiatorType: InitiatorType,
  initiatorId?: string | null
): Promise<ServerResponse<PlanChangeLog>> {
  return actionWrapper(async () => {
    const validatedInput = await planChangeInputSchema.validate({
      subscriptionId,
      previousPlan,
      newPlan,
      initiatorType,
      initiatorId: initiatorId ?? null,
    });

    const planChangeLog = await createPlanChangeLogData({
      subscriptionId: validatedInput.subscriptionId,
      previousPlan: validatedInput.previousPlan,
      newPlan: validatedInput.newPlan,
      initiatorType: validatedInput.initiatorType,
      initiatorId: validatedInput.initiatorId,
    });

    return formatSuccess(BILLING_SUCCESS_MESSAGES.PLAN_CHANGE_LOGGED, planChangeLog);
  });
}
