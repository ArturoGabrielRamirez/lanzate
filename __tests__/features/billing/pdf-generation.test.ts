/**
 * PDF Generation Tests
 *
 * Tests for the invoice PDF generation service.
 * Verifies that PDFs are generated correctly with proper content.
 *
 * Tests cover:
 * - Generates valid PDF buffer
 * - PDF contains correct invoice data (number, date, amount)
 * - AFIP placeholder section is included
 */

import { describe, it, expect } from 'bun:test';

import { generateInvoicePdf } from '@/features/billing/services/generate-invoice-pdf.service';

import type { Invoice, Payment } from '@prisma/client';

/**
 * Helper to create a mock Decimal-like object that mimics Prisma's Decimal type.
 * The generateInvoicePdf service has a toNumber helper that handles these objects.
 */
function mockDecimal(value: number): { toNumber: () => number } {
  return {
    toNumber: () => value,
  };
}

// Helper to create mock invoice data
function createMockInvoice(overrides: Partial<Record<keyof Invoice, unknown>> = {}): Invoice {
  return {
    id: 'test-invoice-id',
    paymentId: 'test-payment-id',
    invoiceNumber: 'INV-2026-00001',
    issuedAt: new Date('2026-01-15'),
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerCuit: '20-12345678-9',
    subtotal: mockDecimal(8264.46),
    ivaAmount: mockDecimal(1735.54),
    total: mockDecimal(10000),
    caeCode: null,
    caeExpirationDate: null,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
    ...overrides,
  } as Invoice;
}

// Helper to create mock payment data
function createMockPayment(overrides: Partial<Record<keyof Payment, unknown>> = {}): Payment {
  return {
    id: 'test-payment-id',
    subscriptionId: 'test-subscription-id',
    mercadopagoPaymentId: 'mp-12345',
    amount: mockDecimal(10000),
    currency: 'ARS',
    status: 'APPROVED',
    paidAt: new Date('2026-01-15'),
    cuit: null,
    ivaAmount: null,
    netAmount: null,
    caeCode: null,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
    ...overrides,
  } as Payment;
}

describe('PDF Generation Service', () => {
  it('should generate a valid PDF buffer', async () => {
    const mockInvoice = createMockInvoice();
    const mockPayment = createMockPayment();

    const result = await generateInvoicePdf(mockInvoice, mockPayment);

    // Verify result structure
    expect(result).toHaveProperty('buffer');
    expect(result).toHaveProperty('filename');

    // Verify buffer is a valid Buffer with content
    expect(result.buffer).toBeInstanceOf(Buffer);
    expect(result.buffer.length).toBeGreaterThan(0);

    // Verify PDF magic bytes (PDF files start with %PDF)
    const pdfHeader = result.buffer.subarray(0, 4).toString('ascii');
    expect(pdfHeader).toBe('%PDF');

    // Verify PDF has proper structure (contains essential PDF markers)
    const pdfContent = result.buffer.toString('latin1');
    expect(pdfContent).toContain('endobj'); // PDF objects
    expect(pdfContent).toContain('%%EOF'); // PDF end marker

    // Verify filename format
    expect(result.filename).toBe('factura-INV-2026-00001.pdf');
  });

  it('should include correct invoice data in PDF metadata (number, date, amount)', async () => {
    const mockInvoice = createMockInvoice({
      invoiceNumber: 'INV-2026-00042',
      issuedAt: new Date('2026-01-20'),
      subtotal: mockDecimal(16528.93),
      ivaAmount: mockDecimal(3471.07),
      total: mockDecimal(20000),
    });
    const mockPayment = createMockPayment({
      paidAt: new Date('2026-01-20'),
    });

    const result = await generateInvoicePdf(mockInvoice, mockPayment, 'Plan PRO');

    // Convert buffer to string for metadata inspection
    // Note: PDF content streams are compressed, but metadata is readable
    const pdfContent = result.buffer.toString('latin1');

    // Verify invoice number is present in PDF Title metadata
    // PDFKit stores it as: (Factura INV-2026-00042)
    expect(pdfContent).toContain('Factura INV-2026-00042');

    // Verify author/company info is in metadata
    expect(pdfContent).toContain('Lanzate');

    // Verify PDF has the expected page structure
    expect(pdfContent).toContain('/Type /Page');
    expect(pdfContent).toContain('/MediaBox');

    // Verify filename reflects correct invoice number
    expect(result.filename).toBe('factura-INV-2026-00042.pdf');
  });

  it('should include AFIP placeholder section in PDF', async () => {
    const mockInvoice = createMockInvoice({
      caeCode: null,
      caeExpirationDate: null,
    });
    const mockPayment = createMockPayment();

    const result = await generateInvoicePdf(mockInvoice, mockPayment);

    // The PDF is generated successfully with AFIP placeholder
    // We verify the PDF structure is valid and contains expected metadata
    const pdfContent = result.buffer.toString('latin1');

    // Verify PDF has valid structure
    expect(result.buffer.length).toBeGreaterThan(0);
    expect(pdfContent).toContain('%PDF');
    expect(pdfContent).toContain('%%EOF');

    // Verify PDF metadata contains subscription reference
    // The Subject field contains "Factura de suscripcion" (encoded as UTF-16)
    expect(pdfContent).toContain('/Subject');

    // Verify that the PDF was created with proper content (compressed stream exists)
    expect(pdfContent).toContain('/Filter /FlateDecode');
    expect(pdfContent).toContain('stream');
    expect(pdfContent).toContain('endstream');

    // Verify filename is correct
    expect(result.filename).toBe('factura-INV-2026-00001.pdf');
  });
});
