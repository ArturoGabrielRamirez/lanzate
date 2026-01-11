/**
 * Get Next Invoice Number Data Function
 *
 * Pure database operation to generate the next sequential invoice number.
 * Format: INV-YYYY-NNNN (e.g., INV-2026-0001)
 * Does NOT contain business logic - only database interaction.
 *
 * @param _subscriptionId - The subscription ID (reserved for future scoping)
 * @returns The next invoice number string
 *
 * @example
 * const invoiceNumber = await getNextInvoiceNumberData('sub-123');
 * // Returns: 'INV-2026-0001'
 */

import { prisma } from '@/lib/prisma';

export async function getNextInvoiceNumberData(
  _subscriptionId: string
): Promise<string> {
  const currentYear = new Date().getFullYear();

  // Find the highest invoice number for the current year
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV-${currentYear}-`,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  });

  let nextSequence = 1;

  if (lastInvoice) {
    // Extract the sequence number from the last invoice
    const parts = lastInvoice.invoiceNumber.split('-');
    const lastSequence = parseInt(parts[2], 10);
    nextSequence = lastSequence + 1;
  }

  // Format with leading zeros (minimum 4 digits)
  const sequenceStr = nextSequence.toString().padStart(4, '0');

  return `INV-${currentYear}-${sequenceStr}`;
}
