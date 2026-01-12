/**
 * Handle Payment Created Service
 *
 * Creates a new payment record in the database when a payment is created in MercadoPago.
 *
 * @param paymentId - The MercadoPago payment ID
 * @param options - Optional dependencies for testing
 *
 * @example
 * await handlePaymentCreated('mp-payment-123', {
 *   subscriptionId: 'sub-456',
 *   paymentData: { id: 'mp-payment-123', status: 'approved', ... }
 * });
 */

import {
  createPaymentData,
  getPaymentByMercadopagoIdData,
} from '@/features/billing/data';
import type { HandlePaymentCreatedOptions } from '@/features/billing/types/billing';
import { mapMercadoPagoPaymentStatus } from '@/features/billing/utils';

export async function handlePaymentCreated(
  paymentId: string,
  options: HandlePaymentCreatedOptions = {}
): Promise<void> {
  const { subscriptionId, paymentData } = options;

  if (!paymentData) {
    console.log(`[Webhook] payment.created: No payment data provided for ${paymentId}`);
    return;
  }

  if (!subscriptionId) {
    console.log(`[Webhook] payment.created: No subscriptionId provided for ${paymentId}`);
    return;
  }

  // Check if payment already exists
  const existingPayment = await getPaymentByMercadopagoIdData(String(paymentData.id));
  if (existingPayment) {
    console.log(`[Webhook] payment.created: Payment ${paymentData.id} already exists`);
    return;
  }

  // Create the payment record
  await createPaymentData({
    subscriptionId,
    mercadopagoPaymentId: String(paymentData.id),
    amount: paymentData.transaction_amount,
    currency: paymentData.currency_id || 'ARS',
    status: mapMercadoPagoPaymentStatus(paymentData.status),
    paidAt: paymentData.date_approved ? new Date(paymentData.date_approved) : undefined,
  });

  console.log(`[Webhook] payment.created: Created payment record for ${paymentData.id}`);
}
