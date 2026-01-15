/**
 * Types for SubscriptionUpgradeButton component
 *
 * Defines props for the reusable upgrade button that redirects
 * users to MercadoPago checkout to upgrade their subscription plan.
 */
import type { PaidPlan } from '@/features/subscriptions/config';

import type { AccountType } from '@prisma/client';
/**
 * Props for the SubscriptionUpgradeButton component
 *
 * @property currentPlan - The user's current plan (used to determine if button should be disabled)
 * @property targetPlan - The plan to upgrade to (PRO or ENTERPRISE)
 * @property variant - Button variant style
 * @property size - Button size
 * @property className - Additional CSS classes
 * @property fullWidth - Whether the button should take full width
 */
export interface SubscriptionUpgradeButtonProps {
  currentPlan: AccountType;
  targetPlan: PaidPlan;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  fullWidth?: boolean;
}
