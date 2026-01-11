/**
 * Get Subscription By MercadoPago ID Data Function
 *
 * Pure database operation to retrieve a subscription by its MercadoPago preapproval ID.
 * Does NOT contain business logic - only database interaction.
 *
 * @param mpPreapprovalId - The MercadoPago preapproval ID
 * @returns The subscription record or null if not found
 *
 * @example
 * const subscription = await getSubscriptionByMercadopagoIdData('mp-preapproval-123');
 */

import { prisma } from '@/lib/prisma';

import type { Subscription } from '@prisma/client';

export async function getSubscriptionByMercadopagoIdData(
  mpPreapprovalId: string
): Promise<Subscription | null> {
  const subscription = await prisma.subscription.findFirst({
    where: { mercadopagoPreapprovalId: mpPreapprovalId },
  });

  return subscription;
}
