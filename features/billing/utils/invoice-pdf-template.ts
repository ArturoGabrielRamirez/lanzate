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

import type { Invoice, Payment, Subscription } from '@prisma/client';

/**
 * Invoice data structure for PDF generation
 */
export interface InvoicePdfData {
  invoice: Invoice;
  payment: Payment;
  subscription: Subscription;
  planName: string;
}

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
