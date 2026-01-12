'use server';

/**
 * Download Invoice Server Action
 *
 * Generates and returns a PDF invoice for a given payment.
 * Validates the payment exists and has an associated invoice,
 * then generates the PDF using the invoice service.
 *
 * Flow:
 * 1. Validate paymentId with Yup schema
 * 2. Fetch payment with invoice from data layer
 * 3. Validate payment exists and has an invoice
 * 4. Generate PDF using service layer
 * 5. Return ServerResponse with PDF buffer and filename
 *
 * @param paymentId - The payment ID to generate invoice for
 * @returns ServerResponse with PDF buffer and filename
 *
 * @example
 * ```tsx
 * import { downloadInvoiceAction } from '@/features/billing/actions/download-invoice.action';
 *
 * const result = await downloadInvoiceAction(paymentId);
 *
 * if (!result.hasError && result.payload) {
 *   // Handle PDF download
 *   const { buffer, filename } = result.payload;
 * }
 * ```
 */

import { getPaymentWithInvoiceData } from '@/features/billing/data/getPaymentWithInvoice.data';
import { paymentIdSchema } from '@/features/billing/schemas/billing.schema';
import {
  generateInvoicePdf,
} from '@/features/billing/services/generateInvoicePdf.service';
import { InvoicePdfResult } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess, formatError } from '@/features/global/utils/format-response';

export async function downloadInvoiceAction(
  paymentId: string
): Promise<ServerResponse<InvoicePdfResult>> {
  return actionWrapper(async () => {
    // Validate payment ID
    const validatedPaymentId = await paymentIdSchema.validate(paymentId);

    // Fetch payment with invoice from data layer
    const payment = await getPaymentWithInvoiceData(validatedPaymentId);

    // Validate payment exists
    if (!payment) {
      return formatError('Pago no encontrado');
    }

    // Validate payment has an associated invoice
    if (!payment.invoice) {
      return formatError('Este pago no tiene una factura asociada');
    }

    // Generate PDF using service layer
    const pdfResult = await generateInvoicePdf(payment.invoice, payment);

    return formatSuccess('Factura generada exitosamente', pdfResult);
  });
}
