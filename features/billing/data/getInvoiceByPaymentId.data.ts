/**
 * Get Invoice By Payment ID Data Function
 *
 * Pure database operation to retrieve an invoice by its associated payment ID.
 * Does NOT contain business logic - only database interaction.
 *
 * @param paymentId - The payment ID
 * @returns The invoice record or null if not found
 *
 * @example
 * const invoice = await getInvoiceByPaymentIdData('payment-123');
 */

import { prisma } from '@/lib/prisma';

import type { Invoice } from '@prisma/client';

export async function getInvoiceByPaymentIdData(
  paymentId: string
): Promise<Invoice | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { paymentId },
  });

  return invoice;
}
