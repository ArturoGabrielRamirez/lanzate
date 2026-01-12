/**
 * Map MercadoPago Payment Status
 *
 * Maps MercadoPago payment status to our PaymentStatus enum.
 *
 * @param mpStatus - The status string from MercadoPago API
 * @returns The corresponding PaymentStatus enum value
 *
 * @example
 * mapMercadoPagoPaymentStatus('approved') // returns 'APPROVED'
 * mapMercadoPagoPaymentStatus('refunded') // returns 'REFUNDED'
 */

import type { PaymentStatus } from '@prisma/client';

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
