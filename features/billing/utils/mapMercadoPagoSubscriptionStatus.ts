/**
 * Map MercadoPago Subscription Status
 *
 * Maps MercadoPago subscription status to our SubscriptionStatus enum.
 *
 * @param mpStatus - The status string from MercadoPago API
 * @returns The corresponding SubscriptionStatus value
 *
 * @example
 * mapMercadoPagoSubscriptionStatus('authorized') // returns 'AUTHORIZED'
 * mapMercadoPagoSubscriptionStatus('cancelled') // returns 'CANCELLED'
 */

import type { SubscriptionStatus } from '@prisma/client';

export function mapMercadoPagoSubscriptionStatus(mpStatus: string): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    authorized: 'AUTHORIZED',
    pending: 'PENDING',
    paused: 'PAUSED',
    cancelled: 'CANCELLED',
  };

  return statusMap[mpStatus] || 'PENDING';
}
