/**
 * Invoice Download API Route
 *
 * GET /api/billing/invoice/[paymentId]
 *
 * Generates and returns a PDF invoice for the specified payment.
 * Requires authentication and validates user access to the payment.
 */

import { NextRequest, NextResponse } from 'next/server';

import { getPaymentWithInvoiceData } from '@/features/billing/data/getPaymentWithInvoice.data';
import { generateInvoicePdf } from '@/features/billing/services/generate-invoice-pdf.service';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{
    paymentId: string;
  }>;
}

/**
 * GET handler for invoice download
 *
 * Generates a PDF invoice for the given payment and returns it as a download.
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Get payment ID from params
    const { paymentId } = await params;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de pago requerido' },
        { status: 400 }
      );
    }

    // Fetch payment with invoice
    const payment = await getPaymentWithInvoiceData(paymentId);

    if (!payment) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      );
    }

    // Validate payment has an invoice
    if (!payment.invoice) {
      return NextResponse.json(
        { error: 'Este pago no tiene una factura asociada' },
        { status: 404 }
      );
    }

    // Generate PDF
    const { buffer, filename } = await generateInvoicePdf(
      payment.invoice,
      payment
    );

    // Return PDF with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[Invoice Download] Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Error al generar la factura' },
      { status: 500 }
    );
  }
}
