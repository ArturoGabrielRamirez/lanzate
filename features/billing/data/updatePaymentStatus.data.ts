/**
 * Update Payment Status Data Function
 *
 * Pure database operation to update a payment's status.
 * Does NOT contain business logic - only database interaction.
 *
 * @param id - The payment ID
 * @param status - The new payment status
 * @returns The updated payment record
 *
 * @example
 * const payment = await updatePaymentStatusData('payment-123', 'REFUNDED');
 */

import { prisma } from '@/lib/prisma';

import type { Payment, PaymentStatus } from '@prisma/client';

export async function updatePaymentStatusData(
  id: string,
  status: PaymentStatus
): Promise<Payment> {
  const payment = await prisma.payment.update({
    where: { id },
    data: { status },
  });

  return payment;
}
