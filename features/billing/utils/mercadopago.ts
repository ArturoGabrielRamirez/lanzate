/**
 * MercadoPago Utility Functions
 *
 * Utility functions for mapping MercadoPago API statuses
 * to internal application enum values.
 */

import type { PaymentStatus } from '@prisma/client';

/**
 * Maps MercadoPago payment status to our PaymentStatus enum
 *
 * @param mpStatus - The status string from MercadoPago API
 * @returns The corresponding PaymentStatus enum value
 *
 * @example
 * mapMercadoPagoPaymentStatus('approved') // returns 'APPROVED'
 * mapMercadoPagoPaymentStatus('refunded') // returns 'REFUNDED'
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
 *
 * @param mpStatus - The status string from MercadoPago API
 * @returns The corresponding SubscriptionStatus value
 *
 * @example
 * mapMercadoPagoSubscriptionStatus('authorized') // returns 'AUTHORIZED'
 * mapMercadoPagoSubscriptionStatus('cancelled') // returns 'CANCELLED'
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
