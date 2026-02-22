'use server';

import { BILLING_ERROR_MESSAGES, BILLING_SUCCESS_MESSAGES } from '@/features/billing/constants';
import { getPaymentWithInvoiceData } from '@/features/billing/data/getPaymentWithInvoice.data';
import { paymentIdSchema } from '@/features/billing/schemas/billing.schema';
import { generateInvoicePdf } from '@/features/billing/services/generate-invoice-pdf.service';
import { InvoicePdfResult } from '@/features/billing/types/billing';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';

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
 * const result = await downloadInvoiceAction(paymentId);
 *
 * if (!result.hasError && result.payload) {
 *   // Handle PDF download
 *   const { buffer, filename } = result.payload;
 * }
 * ```
 */
export async function downloadInvoiceAction(
  paymentId: string
): Promise<ServerResponse<InvoicePdfResult>> {
  return actionWrapper(async () => {
    const validatedPaymentId = await paymentIdSchema.validate(paymentId);

    const payment = await getPaymentWithInvoiceData(validatedPaymentId);

    if (!payment) {
      throw new Error(BILLING_ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }

    if (!payment.invoice) {
      throw new Error(BILLING_ERROR_MESSAGES.INVOICE_NOT_FOUND);
    }

    const pdfResult = await generateInvoicePdf(payment.invoice, payment);

    return formatSuccess(BILLING_SUCCESS_MESSAGES.INVOICE_GENERATED, pdfResult);
  });
}
