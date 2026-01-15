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
  formatCurrencyARS,
  formatDateAR,
  getBillingPeriod,
  getInvoiceFilename,
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
      });
      doc.on('error', reject);

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

/**
 * Draw the invoice header with company info and invoice details
 */
function drawHeader(doc: PDFKit.PDFDocument, invoice: { invoiceNumber: string; issuedAt: Date }) {
  const { colors, fonts, margins } = PDF_STYLES;

  // Company name and logo placeholder
  doc
    .fontSize(fonts.title)
    .fillColor(colors.primary)
    .text(COMPANY_INFO.name, margins.page, margins.page);

  doc
    .fontSize(fonts.small)
    .fillColor(colors.secondary)
    .text(COMPANY_INFO.tagline, margins.page, margins.page + 30);

  // Invoice details (right aligned)
  const rightX = doc.page.width - margins.page - 150;

  doc
    .fontSize(fonts.heading)
    .fillColor(colors.primary)
    .text('FACTURA', rightX, margins.page, { width: 150, align: 'right' });

  doc
    .fontSize(fonts.body)
    .fillColor(colors.secondary)
    .text(`N° ${invoice.invoiceNumber}`, rightX, margins.page + 20, { width: 150, align: 'right' })
    .text(`Fecha: ${formatDateAR(invoice.issuedAt)}`, rightX, margins.page + 35, {
      width: 150,
      align: 'right',
    });

  // Separator line
  doc
    .moveTo(margins.page, margins.page + 60)
    .lineTo(doc.page.width - margins.page, margins.page + 60)
    .strokeColor(colors.border)
    .stroke();

  doc.y = margins.page + 80;
}

/**
 * Draw customer information section
 */
function drawCustomerSection(
  doc: PDFKit.PDFDocument,
  invoice: { customerName: string; customerEmail: string; customerCuit: string | null }
) {
  const { colors, fonts, margins } = PDF_STYLES;
  const startY = doc.y;

  // Emisor (Company)
  doc
    .fontSize(fonts.heading)
    .fillColor(colors.primary)
    .text('EMISOR', margins.page, startY);

  doc
    .fontSize(fonts.body)
    .fillColor(colors.secondary)
    .text(COMPANY_INFO.name, margins.page, startY + 18)
    .text(`CUIT: ${COMPANY_INFO.cuit}`, margins.page, startY + 33)
    .text(COMPANY_INFO.address, margins.page, startY + 48)
    .text(COMPANY_INFO.email, margins.page, startY + 63);

  // Receptor (Customer)
  const midX = doc.page.width / 2;

  doc
    .fontSize(fonts.heading)
    .fillColor(colors.primary)
    .text('RECEPTOR', midX, startY);

  doc
    .fontSize(fonts.body)
    .fillColor(colors.secondary)
    .text(invoice.customerName, midX, startY + 18)
    .text(invoice.customerEmail, midX, startY + 33)
    .text(`CUIT: ${invoice.customerCuit ?? 'No especificado'}`, midX, startY + 48);

  doc.y = startY + 90;

  // Separator
  doc
    .moveTo(margins.page, doc.y)
    .lineTo(doc.page.width - margins.page, doc.y)
    .strokeColor(colors.border)
    .stroke();

  doc.y += margins.section;
}

/**
 * Draw line items table
 */
function drawLineItems(
  doc: PDFKit.PDFDocument,
  planName: string,
  payment: { paidAt: Date | null },
  invoice: { subtotal: number }
) {
  const { colors, fonts, margins } = PDF_STYLES;
  const startY = doc.y;
  const colWidths = {
    description: 280,
    period: 120,
    amount: 90,
  };

  // Table header
  doc
    .fontSize(fonts.heading)
    .fillColor(colors.primary)
    .text('Descripción', margins.page, startY)
    .text('Período', margins.page + colWidths.description, startY)
    .text('Importe', margins.page + colWidths.description + colWidths.period, startY, {
      width: colWidths.amount,
      align: 'right',
    });

  // Header underline
  doc.y = startY + 18;
  doc
    .moveTo(margins.page, doc.y)
    .lineTo(doc.page.width - margins.page, doc.y)
    .strokeColor(colors.border)
    .stroke();

  doc.y += 10;

  // Line item
  const itemY = doc.y;
  doc
    .fontSize(fonts.body)
    .fillColor(colors.secondary)
    .text(`Suscripción ${planName}`, margins.page, itemY)
    .text(getBillingPeriod(payment.paidAt), margins.page + colWidths.description, itemY)
    .text(
      formatCurrencyARS(invoice.subtotal),
      margins.page + colWidths.description + colWidths.period,
      itemY,
      { width: colWidths.amount, align: 'right' }
    );

  doc.y = itemY + 30;

  // Bottom line
  doc
    .moveTo(margins.page, doc.y)
    .lineTo(doc.page.width - margins.page, doc.y)
    .strokeColor(colors.border)
    .stroke();

  doc.y += margins.section;
}

/**
 * Draw totals section with IVA breakdown
 */
function drawTotals(
  doc: PDFKit.PDFDocument,
  invoice: { subtotal: number; ivaAmount: number; total: number }
) {
  const { colors, fonts, margins } = PDF_STYLES;
  const startY = doc.y;
  const rightX = doc.page.width - margins.page - 200;
  const valueX = doc.page.width - margins.page - 100;

  // Subtotal
  doc
    .fontSize(fonts.body)
    .fillColor(colors.secondary)
    .text('Subtotal:', rightX, startY)
    .text(formatCurrencyARS(invoice.subtotal), valueX, startY, { width: 100, align: 'right' });

  // IVA
  doc
    .text('IVA (21%):', rightX, startY + 18)
    .text(formatCurrencyARS(invoice.ivaAmount), valueX, startY + 18, { width: 100, align: 'right' });

  // Separator
  doc
    .moveTo(rightX, startY + 38)
    .lineTo(doc.page.width - margins.page, startY + 38)
    .strokeColor(colors.border)
    .stroke();

  // Total
  doc
    .fontSize(fonts.heading)
    .fillColor(colors.primary)
    .text('TOTAL:', rightX, startY + 48)
    .text(formatCurrencyARS(invoice.total), valueX, startY + 48, { width: 100, align: 'right' });

  doc.y = startY + 80;
}

/**
 * Draw AFIP placeholder section
 */
function drawAfipSection(doc: PDFKit.PDFDocument, invoice: { caeCode: string | null; caeExpirationDate: Date | null }) {
  const { colors, fonts, margins } = PDF_STYLES;
  const startY = doc.y + margins.section;

  // AFIP Box
  doc
    .rect(margins.page, startY, doc.page.width - margins.page * 2, 60)
    .strokeColor(colors.border)
    .stroke();

  doc
    .fontSize(fonts.small)
    .fillColor(colors.secondary)
    .text('INFORMACIÓN AFIP', margins.page + 10, startY + 10);

  if (invoice.caeCode) {
    doc
      .fontSize(fonts.body)
      .text(`CAE: ${invoice.caeCode}`, margins.page + 10, startY + 25)
      .text(
        `Vencimiento CAE: ${invoice.caeExpirationDate ? formatDateAR(invoice.caeExpirationDate) : '-'}`,
        margins.page + 10,
        startY + 40
      );
  } else {
    doc
      .fontSize(fonts.small)
      .fillColor(colors.secondary)
      .text(
        'Documento no fiscal - CAE pendiente de emisión',
        margins.page + 10,
        startY + 30
      );
  }

  doc.y = startY + 80;
}

/**
 * Draw footer with legal disclaimer
 */
function drawFooter(doc: PDFKit.PDFDocument) {
  const { colors, fonts, margins } = PDF_STYLES;
  const footerY = doc.page.height - margins.page - 40;

  doc
    .fontSize(fonts.small)
    .fillColor(colors.secondary)
    .text(
      'Este documento es un comprobante de pago. Para consultas: ' + COMPANY_INFO.email,
      margins.page,
      footerY,
      { align: 'center', width: doc.page.width - margins.page * 2 }
    )
    .text(
      `Generado el ${formatDateAR(new Date())} - ${COMPANY_INFO.name}`,
      margins.page,
      footerY + 15,
      { align: 'center', width: doc.page.width - margins.page * 2 }
    );
}
