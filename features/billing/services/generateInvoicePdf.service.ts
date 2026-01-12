/**
 * Generate Invoice PDF Service
 *
 * Generates a PDF buffer for an invoice. This is a placeholder/stub implementation
 * that will be replaced with actual PDF generation in Task Group 10.
 *
 * The actual PDF template will include:
 * - Header: Company logo placeholder, invoice number, date
 * - Customer section: name, email, CUIT placeholder
 * - Line items: plan name, period, amount
 * - Totals: subtotal, IVA (21%), total
 * - Footer: AFIP CAE placeholder section (for future compliance)
 *
 * @param invoice - The invoice data
 * @param payment - The payment data
 * @returns Buffer containing the PDF data
 *
 * @example
 * const pdfBuffer = await generateInvoicePdf(invoice, payment);
 */

import { InvoicePdfResult } from '@/features/billing/types/billing';

import type { Invoice, Payment } from '@prisma/client';

/**
 * Generates a PDF buffer for the given invoice and payment.
 *
 * NOTE: This is a placeholder implementation. The actual PDF generation
 * will be implemented in Task Group 10 using a PDF library like
 * @react-pdf/renderer, pdfkit, or jspdf.
 *
 * @param invoice - Invoice data from the database
 * @param payment - Payment data from the database
 * @returns InvoicePdfResult with buffer and filename
 */
export async function generateInvoicePdf(
  invoice: Invoice,
  payment: Payment
): Promise<InvoicePdfResult> {
  // Placeholder PDF content
  // This will be replaced with actual PDF generation in Task Group 10
  const placeholderContent = createPlaceholderPdfContent(invoice, payment);

  // Convert to Buffer
  const buffer = Buffer.from(placeholderContent, 'utf-8');

  // Generate filename based on invoice number
  const filename = `${invoice.invoiceNumber}.pdf`;

  return {
    buffer,
    filename,
  };
}

/**
 * Creates placeholder content for the PDF.
 * This is a temporary implementation until Task Group 10 adds proper PDF generation.
 *
 * @internal
 */
function createPlaceholderPdfContent(invoice: Invoice, payment: Payment): string {
  const formattedDate = invoice.issuedAt.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedSubtotal = formatCurrency(Number(invoice.subtotal));
  const formattedIva = formatCurrency(Number(invoice.ivaAmount));
  const formattedTotal = formatCurrency(Number(invoice.total));

  // Placeholder text content that simulates what the PDF will contain
  // This will be replaced with actual PDF binary content in Task Group 10
  return `
================================================================================
                              FACTURA / INVOICE
================================================================================

Numero de Factura: ${invoice.invoiceNumber}
Fecha de Emision: ${formattedDate}

--------------------------------------------------------------------------------
                            DATOS DEL CLIENTE
--------------------------------------------------------------------------------

Nombre: ${invoice.customerName}
Email: ${invoice.customerEmail}
CUIT: ${invoice.customerCuit || 'No especificado'}

--------------------------------------------------------------------------------
                              DETALLE
--------------------------------------------------------------------------------

Concepto                                                           Monto
--------------------------------------------------------------------------------
Suscripcion - Pago ID: ${payment.mercadopagoPaymentId}
Moneda: ${payment.currency}

--------------------------------------------------------------------------------
                              TOTALES
--------------------------------------------------------------------------------

Subtotal:                                                    ${formattedSubtotal}
IVA (21%):                                                   ${formattedIva}
--------------------------------------------------------------------------------
TOTAL:                                                       ${formattedTotal}

--------------------------------------------------------------------------------
                         INFORMACION FISCAL
--------------------------------------------------------------------------------

CAE: ${invoice.caeCode || 'Pendiente'}
Vencimiento CAE: ${invoice.caeExpirationDate ? invoice.caeExpirationDate.toLocaleDateString('es-AR') : 'N/A'}

================================================================================
                  Documento generado automaticamente
           Este es un placeholder - PDF real en Task Group 10
================================================================================
`.trim();
}

/**
 * Formats a number as Argentine Peso currency
 *
 * @internal
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
}
