/**
 * Types for SubscriptionStatusCard component
 *
 * Defines props for the SubscriptionStatusCard component that displays
 * subscription status information in a compact card format for the
 * membership tab integration.
 *
 * Features displayed:
 * - Plan type badge (FREE, PRO, ENTERPRISE)
 * - Subscription status (PENDING, AUTHORIZED, PAUSED, CANCELLED)
 * - Next billing date (formatted)
 * - MercadoPago subscription ID (for reference)
 * - Link to billing history page
 */

import type { SubscriptionStatus } from '@/features/billing/types/billing';

/**
 * Props for the SubscriptionStatusCard component
 *
 * The component receives subscription status data from the
 * getSubscriptionStatusAction server action and displays it
 * in a compact card format.
 */
export type SubscriptionStatusCardProps = {
  /** Subscription status data from getSubscriptionStatusAction */
  subscriptionStatus: SubscriptionStatus;
  /** Additional CSS classes for the card container */
  className?: string;
};
