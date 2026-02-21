/**
 * Generate Invoice PDF Service
 *
 * Creates a PDF invoice document using pdfkit.
 * Includes company header, customer info, line items, totals, and AFIP placeholder.
 */

import PDFDocument from 'pdfkit';


import type { InvoicePdfResult } from '@/features/billing/types/billing';
import {
  COMPANY_INFO,
  PDF_STYLES,
  getInvoiceFilename,
  drawHeader,
  drawCustomerSection,
  drawLineItems,
  drawTotals,
  drawAfipSection,
  drawFooter,
} from '@/features/billing/utils/invoice-pdf-template';

import type { Invoice, Payment } from '@prisma/client';

/**
 * Convert Prisma Decimal to number
 * Handles both Decimal objects and plain numbers
 */
function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

/**
 * Generate a PDF invoice from invoice and payment data
 *
 * @param invoice - The invoice record
 * @param payment - The associated payment record
 * @param planName - Optional plan name (defaults to generic description)
 * @returns Buffer containing the PDF and suggested filename
 */
export async function generateInvoicePdf(
  invoice: Invoice,
  payment: Payment,
  planName: string = 'Plan de Suscripción'
): Promise<InvoicePdfResult> {
  // Convert Decimal fields to numbers for PDF generation
  const invoiceData = {
    ...invoice,
    subtotal: toNumber(invoice.subtotal),
    ivaAmount: toNumber(invoice.ivaAmount),
    total: toNumber(invoice.total),
  };

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: PDF_STYLES.margins.page,
        info: {
          Title: `Factura ${invoice.invoiceNumber}`,
          Author: COMPANY_INFO.name,
          Subject: 'Factura de suscripción',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          buffer,
          filename: getInvoiceFilename(invoice.invoiceNumber),
        });
        doc.on('error', (err: Error) => reject(err));

        // Generate PDF content
        drawHeader(doc, invoiceData);
        drawCustomerSection(doc, invoiceData);
        drawLineItems(doc, planName, payment, invoiceData);
        drawTotals(doc, invoiceData);
        drawAfipSection(doc, invoiceData);
        drawFooter(doc);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
}
