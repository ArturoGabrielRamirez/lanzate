/**
 * Handle Payment Created Service
 *
 * Creates a new payment record in the database when a payment is created in MercadoPago.
 * Fetches payment data from MercadoPago API if not provided via options.
 *
 * @param paymentId - The MercadoPago payment ID
 * @param options - Optional dependencies for testing (allows injecting mock data)
 *
 * @example
 * // Production usage (fetches from API):
 * await handlePaymentCreated('mp-payment-123');
 *
 * // Testing usage (uses injected data):
 * await handlePaymentCreated('mp-payment-123', {
 *   subscriptionId: 'sub-456',
 *   paymentData: { id: 'mp-payment-123', status: 'approved', ... }
 * });
 */

import {
  createPaymentData,
  getPaymentByMercadopagoIdData,
  getSubscriptionByMercadopagoIdData,
} from '@/features/billing/data';
import type { HandlePaymentCreatedOptions } from '@/features/billing/types/billing';
import { getMercadoPagoPayment, mapMercadoPagoPaymentStatus } from '@/features/billing/utils';

export async function handlePaymentCreated(
  paymentId: string,
  options: HandlePaymentCreatedOptions = {}
): Promise<void> {
  // Use injected data for testing, or fetch from MercadoPago API
  const paymentData = options.paymentData ?? (await getMercadoPagoPayment(paymentId));

  // Get subscriptionId from options, metadata, or lookup by preapproval_id
  let subscriptionId = options.subscriptionId;

  if (!subscriptionId && paymentData.metadata?.preapproval_id) {
    const subscription = await getSubscriptionByMercadopagoIdData(
      paymentData.metadata.preapproval_id
    );
    subscriptionId = subscription?.id;
  }

  if (!subscriptionId) {
    console.log(
      `[Webhook] payment.created: Could not determine subscriptionId for payment ${paymentId}`
    );
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
