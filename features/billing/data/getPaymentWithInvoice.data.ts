/**
 * Get Payment With Invoice Data Function
 *
 * Pure database operation to retrieve a payment by its ID along with
 * its associated invoice data.
 * Does NOT contain business logic - only database interaction.
 *
 * @param paymentId - The payment ID
 * @returns The payment record with invoice or null if not found
 *
 * @example
 * const paymentWithInvoice = await getPaymentWithInvoiceData('payment-123');
 */

import { PaymentWithInvoice } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';


export async function getPaymentWithInvoiceData(
  paymentId: string
): Promise<PaymentWithInvoice | null> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      invoice: true,
    },
  });

  return payment;
}
