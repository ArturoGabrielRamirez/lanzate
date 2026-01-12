/**
 * Get MercadoPago Payment
 *
 * Fetches payment details from MercadoPago API.
 *
 * @param paymentId - The MercadoPago payment ID
 * @returns The payment data from MercadoPago
 *
 * @example
 * const payment = await getMercadoPagoPayment('123456789');
 * console.log(payment.status); // 'approved'
 */

import { Payment } from 'mercadopago';

import type { MPPaymentData } from '@/features/billing/types/billing';
import { getMercadoPagoConfig } from '@/features/billing/utils/mercadopagoConfig';

export async function getMercadoPagoPayment(paymentId: string): Promise<MPPaymentData> {
  const paymentClient = new Payment(getMercadoPagoConfig());
  const response = await paymentClient.get({ id: paymentId });

  return {
    id: response.id ?? paymentId,
    status: response.status ?? 'pending',
    transaction_amount: response.transaction_amount ?? 0,
    currency_id: response.currency_id ?? 'ARS',
    date_approved: response.date_approved ?? undefined,
    payer: response.payer
      ? {
          email: response.payer.email ?? undefined,
        }
      : undefined,
    metadata: response.metadata as { preapproval_id?: string } | undefined,
  };
}
