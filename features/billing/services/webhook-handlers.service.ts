/**
 * Webhook Handlers Service
 *
 * Service functions to handle MercadoPago webhook notifications.
 * Each handler processes a specific notification type and updates the database accordingly.
 *
 * These are stub implementations for TDD - full implementation will be done in task 3.2.
 */

import {
  createPaymentData,
  updatePaymentStatusData,
  getPaymentByMercadopagoIdData,
  getSubscriptionByMercadopagoIdData,
  updateSubscriptionMercadopagoData,
} from '@/features/billing/data';

import type { PaymentStatus } from '@prisma/client';

/**
 * Maps MercadoPago payment status to our PaymentStatus enum
 */
export function mapMercadoPagoPaymentStatus(mpStatus: string): PaymentStatus {
  const statusMap: Record<string, PaymentStatus> = {
    approved: 'APPROVED',
    pending: 'PENDING',
    rejected: 'REJECTED',
    refunded: 'REFUNDED',
    partially_refunded: 'PARTIALLY_REFUNDED',
    cancelled: 'CANCELLED',
    in_process: 'PENDING',
    in_mediation: 'PENDING',
    charged_back: 'REFUNDED',
  };

  return statusMap[mpStatus] || 'PENDING';
}

/**
 * Maps MercadoPago subscription status to our SubscriptionStatus
 */
export function mapMercadoPagoSubscriptionStatus(
  mpStatus: string
): 'PENDING' | 'AUTHORIZED' | 'PAUSED' | 'CANCELLED' {
  const statusMap: Record<string, 'PENDING' | 'AUTHORIZED' | 'PAUSED' | 'CANCELLED'> = {
    authorized: 'AUTHORIZED',
    pending: 'PENDING',
    paused: 'PAUSED',
    cancelled: 'CANCELLED',
  };

  return statusMap[mpStatus] || 'PENDING';
}

/**
 * MercadoPago Payment data structure (subset of fields we use)
 */
interface MPPaymentData {
  id: string | number;
  status: string;
  transaction_amount: number;
  currency_id: string;
  date_approved?: string;
  payer?: {
    email?: string;
  };
  metadata?: {
    preapproval_id?: string;
  };
}

/**
 * MercadoPago Preapproval data structure (subset of fields we use)
 */
interface MPPreapprovalData {
  id: string;
  status: string;
  external_reference?: string;
  next_payment_date?: string;
}

/**
 * Options for handlePaymentCreated to allow dependency injection for testing
 */
interface HandlePaymentCreatedOptions {
  getPayment?: (id: string) => Promise<MPPaymentData>;
  subscriptionId?: string;
  paymentData?: MPPaymentData;
}

/**
 * Options for handlePaymentUpdated to allow dependency injection for testing
 */
interface HandlePaymentUpdatedOptions {
  getPayment?: (id: string) => Promise<MPPaymentData>;
  paymentData?: MPPaymentData;
}

/**
 * Options for handleSubscriptionPreapprovalUpdated to allow dependency injection for testing
 */
interface HandleSubscriptionPreapprovalUpdatedOptions {
  getPreapproval?: (id: string) => Promise<MPPreapprovalData>;
  preapprovalData?: MPPreapprovalData;
}

/**
 * Handle payment.created notification
 *
 * Creates a new payment record in the database when a payment is created in MercadoPago.
 *
 * @param paymentId - The MercadoPago payment ID
 * @param options - Optional dependencies for testing
 */
export async function handlePaymentCreated(
  paymentId: string,
  options: HandlePaymentCreatedOptions = {}
): Promise<void> {
  const { subscriptionId, paymentData } = options;

  if (!paymentData) {
    // In production, fetch from MercadoPago API
    // For now, we skip if no data provided
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

/**
 * Handle payment.updated notification
 *
 * Updates an existing payment record when its status changes in MercadoPago.
 * This includes handling refunds (status: refunded, partially_refunded).
 *
 * @param paymentId - The MercadoPago payment ID
 * @param options - Optional dependencies for testing
 */
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

/**
 * Handle subscription_preapproval.updated notification
 *
 * Updates subscription status when it changes in MercadoPago.
 * Handles: authorized, cancelled, paused statuses.
 *
 * @param preapprovalId - The MercadoPago preapproval ID
 * @param options - Optional dependencies for testing
 */
export async function handleSubscriptionPreapprovalUpdated(
  preapprovalId: string,
  options: HandleSubscriptionPreapprovalUpdatedOptions = {}
): Promise<void> {
  const { preapprovalData } = options;

  if (!preapprovalData) {
    console.log(
      `[Webhook] subscription_preapproval.updated: No preapproval data provided for ${preapprovalId}`
    );
    return;
  }

  // Find the subscription by MercadoPago preapproval ID
  const subscription = await getSubscriptionByMercadopagoIdData(preapprovalId);
  if (!subscription) {
    console.log(
      `[Webhook] subscription_preapproval.updated: Subscription not found for preapproval ${preapprovalId}`
    );
    return;
  }

  // Map the status
  const newStatus = mapMercadoPagoSubscriptionStatus(preapprovalData.status);

  // Update the subscription
  await updateSubscriptionMercadopagoData(subscription.id, {
    mercadopagoPreapprovalId: preapprovalId,
    status: newStatus,
    nextBillingDate: preapprovalData.next_payment_date
      ? new Date(preapprovalData.next_payment_date)
      : undefined,
  });

  console.log(
    `[Webhook] subscription_preapproval.updated: Updated subscription ${subscription.id} to status ${newStatus}`
  );
}
