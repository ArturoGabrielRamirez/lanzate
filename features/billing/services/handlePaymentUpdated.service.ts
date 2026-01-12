/**
 * Handle Payment Updated Service
 *
 * Updates an existing payment record when its status changes in MercadoPago.
 * This includes handling refunds (status: refunded, partially_refunded).
 *
 * @param paymentId - The MercadoPago payment ID
 * @param options - Optional dependencies for testing
 *
 * @example
 * await handlePaymentUpdated('mp-payment-123', {
 *   paymentData: { id: 'mp-payment-123', status: 'refunded', ... }
 * });
 */

import {
  updatePaymentStatusData,
  getPaymentByMercadopagoIdData,
} from '@/features/billing/data';
import type { HandlePaymentUpdatedOptions } from '@/features/billing/types/billing';
import { mapMercadoPagoPaymentStatus } from '@/features/billing/utils';

export async function handlePaymentUpdated(
  paymentId: string,
  options: HandlePaymentUpdatedOptions = {}
): Promise<void> {
  const { paymentData } = options;

  if (!paymentData) {
    console.log(`[Webhook] payment.updated: No payment data provided for ${paymentId}`);
    return;
  }

  // Find the existing payment
  const existingPayment = await getPaymentByMercadopagoIdData(paymentId);
  if (!existingPayment) {
    console.log(`[Webhook] payment.updated: Payment ${paymentId} not found in database`);
    return;
  }

  // Map the new status
  const newStatus = mapMercadoPagoPaymentStatus(paymentData.status);

  // Update the payment status
  await updatePaymentStatusData(existingPayment.id, newStatus);

  console.log(`[Webhook] payment.updated: Updated payment ${paymentId} to status ${newStatus}`);
}
