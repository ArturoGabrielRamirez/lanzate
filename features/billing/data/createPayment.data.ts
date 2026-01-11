/**
 * Create Payment Data Function
 *
 * Pure database operation to insert a new payment record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param input - Payment creation parameters
 * @returns The created payment record
 *
 * @example
 * const payment = await createPaymentData({
 *   subscriptionId: 'sub-123',
 *   mercadopagoPaymentId: 'mp-456',
 *   amount: 10000,
 *   currency: 'ARS',
 *   status: 'APPROVED',
 *   paidAt: new Date(),
 * });
 */

import type { CreatePaymentInput } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

import type { Payment } from '@prisma/client';

export async function createPaymentData(input: CreatePaymentInput): Promise<Payment> {
  const payment = await prisma.payment.create({
    data: {
      subscriptionId: input.subscriptionId,
      mercadopagoPaymentId: input.mercadopagoPaymentId,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      paidAt: input.paidAt,
      // AFIP-ready fields
      cuit: input.cuit,
      ivaAmount: input.ivaAmount,
      netAmount: input.netAmount,
      caeCode: input.caeCode,
    },
  });

  return payment;
}
