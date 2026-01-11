/**
 * Create Invoice Data Function
 *
 * Pure database operation to insert a new invoice record with sequential number.
 * Does NOT contain business logic - only database interaction.
 *
 * @param input - Invoice creation parameters
 * @returns The created invoice record
 *
 * @example
 * const invoice = await createInvoiceData({
 *   paymentId: 'payment-123',
 *   customerName: 'John Doe',
 *   customerEmail: 'john@example.com',
 *   subtotal: 8264.46,
 *   ivaAmount: 1735.54,
 *   total: 10000,
 * });
 */

import { getNextInvoiceNumberData } from '@/features/billing/data/getNextInvoiceNumber.data';
import type { CreateInvoiceInput } from '@/features/billing/types/billing';
import { prisma } from '@/lib/prisma';

import type { Invoice } from '@prisma/client';

export async function createInvoiceData(input: CreateInvoiceInput): Promise<Invoice> {
  // Get next invoice number
  const invoiceNumber = await getNextInvoiceNumberData(input.paymentId);

  const invoice = await prisma.invoice.create({
    data: {
      paymentId: input.paymentId,
      invoiceNumber,
      issuedAt: new Date(),
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      subtotal: input.subtotal,
      ivaAmount: input.ivaAmount,
      total: input.total,
      customerCuit: input.customerCuit,
      caeCode: input.caeCode,
      caeExpirationDate: input.caeExpirationDate,
    },
  });

  return invoice;
}
