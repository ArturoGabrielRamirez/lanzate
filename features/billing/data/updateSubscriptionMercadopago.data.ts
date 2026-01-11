/**
 * Update Subscription MercadoPago Data Function
 *
 * Pure database operation to update subscription with MercadoPago data.
 * Does NOT contain business logic - only database interaction.
 *
 * @param subscriptionId - The subscription ID
 * @param mpData - MercadoPago subscription data
 * @returns The updated subscription record
 *
 * @example
 * const subscription = await updateSubscriptionMercadopagoData('sub-123', {
 *   mercadopagoPreapprovalId: 'mp-preapproval-456',
 *   status: 'AUTHORIZED',
 *   nextBillingDate: new Date('2026-02-10'),
 * });
 */

import type { MercadopagoSubscriptionData } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

import type { Subscription } from '@prisma/client';

export async function updateSubscriptionMercadopagoData(
  subscriptionId: string,
  mpData: MercadopagoSubscriptionData
): Promise<Subscription> {
  const subscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      mercadopagoPreapprovalId: mpData.mercadopagoPreapprovalId,
      status: mpData.status,
      nextBillingDate: mpData.nextBillingDate,
    },
  });

  return subscription;
}
