import type { AccountType } from '@prisma/client';

/**
 * Plan configuration type
 *
 * Defines the structure for plan pricing and metadata.
 */
export interface PlanConfig {
  /** Price in ARS (monthly) - 0 for free plan */
  price: number;
  /** Display name shown to users */
  displayName: string;
  /** Short description of the plan */
  description: string;
  /** Currency code */
  currency: string;
  /** Billing frequency in months */
  billingFrequency: number;
}

/**
 * Paid plans only (excludes FREE)
 */
export type PaidPlan = Exclude<AccountType, 'FREE'>;

/**
 * Complete plan configuration for all account types
 *
 * Defines pricing, display names, and descriptions for each subscription plan.
 * All plan-related lookups across the application should reference this config
 * to ensure consistency.
 *
 * @example
 * import { PLAN_CONFIG } from '@/features/subscriptions/config';
 *
 * const proPrice = PLAN_CONFIG.PRO.price; // 10000
 * const proName = PLAN_CONFIG.PRO.displayName; // 'Business'
 */
export const PLAN_CONFIG: Record<AccountType, PlanConfig> = {
  FREE: {
    price: 0,
    displayName: 'Starter',
    description: 'Para empezar tu negocio',
    currency: 'ARS',
    billingFrequency: 1,
  },
  PRO: {
    price: 10000,
    displayName: 'Business',
    description: 'Para negocios en crecimiento',
    currency: 'ARS',
    billingFrequency: 1,
  },
  ENTERPRISE: {
    price: 25000,
    displayName: 'Enterprise',
    description: 'Para grandes empresas',
    currency: 'ARS',
    billingFrequency: 1,
  },
} as const;

/**
 * List of all paid plans
 */
export const PAID_PLANS: PaidPlan[] = ['PRO', 'ENTERPRISE'];
