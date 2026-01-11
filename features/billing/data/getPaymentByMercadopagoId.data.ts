/**
 * Get Payment By MercadoPago ID Data Function
 *
 * Pure database operation to retrieve a payment by its MercadoPago ID.
 * Does NOT contain business logic - only database interaction.
 *
 * @param mpId - The MercadoPago payment ID
 * @returns The payment record or null if not found
 *
 * @example
 * const payment = await getPaymentByMercadopagoIdData('mp-payment-123');
 */

import { prisma } from '@/lib/prisma';

import type { Payment } from '@prisma/client';

export async function getPaymentByMercadopagoIdData(
  mpId: string
): Promise<Payment | null> {
  const payment = await prisma.payment.findUnique({
    where: { mercadopagoPaymentId: mpId },
  });

  return payment;
}
