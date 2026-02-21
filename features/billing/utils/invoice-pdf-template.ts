/**
 * Invoice PDF Template
 *
 * Defines the structure and formatting for invoice PDF generation.
 * Uses pdfkit for server-side PDF creation.
 *
 * Template sections:
 * - Header: Company info, invoice number, date
 * - Customer: name, email, CUIT
 * - Line items: plan details and amounts
 * - Totals: subtotal, IVA (21%), total
 * - Footer: AFIP CAE placeholder
 */

/**
 * Company information for invoice header
 */
export const COMPANY_INFO = {
  name: 'Lanzate',
  tagline: 'Plataforma de E-commerce',
  address: 'Buenos Aires, Argentina',
  cuit: '00-00000000-0', // Placeholder CUIT
  email: 'facturacion@lanzate.app',
} as const;

/**
 * PDF styling constants
 */
export const PDF_STYLES = {
  colors: {
    primary: '#1a1a1a',
    secondary: '#666666',
    accent: '#2563eb',
    border: '#e5e5e5',
    success: '#16a34a',
  },
  fonts: {
    title: 24,
    subtitle: 14,
    heading: 12,
    body: 10,
    small: 8,
  },
  margins: {
    page: 50,
    section: 20,
    line: 5,
  },
} as const;

/**
 * Format currency in ARS with Argentine locale
 */
export function formatCurrencyARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date in Argentine format (DD/MM/YYYY)
 */
export function formatDateAR(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Format long date in Argentine format
 */
export function formatLongDateAR(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Calculate billing period text based on payment date
 */
export function getBillingPeriod(paidAt: Date | null): string {
  const date = paidAt ?? new Date();
  const month = new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(date);
  const year = date.getFullYear();
  return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

/**
 * Generate invoice filename
 */
export function getInvoiceFilename(invoiceNumber: string): string {
  return `factura-${invoiceNumber}.pdf`;
}

/**
 * Draw the invoice header with company info and invoice details
 */
export function drawHeader(doc: PDFKit.PDFDocument, invoice: { invoiceNumber: string; issuedAt: Date }) {
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
export function drawCustomerSection(
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
export function drawLineItems(
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
export function drawTotals(
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
export function drawAfipSection(doc: PDFKit.PDFDocument, invoice: { caeCode: string | null; caeExpirationDate: Date | null }) {
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
export function drawFooter(doc: PDFKit.PDFDocument) {
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
