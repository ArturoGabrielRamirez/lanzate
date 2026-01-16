import type { AccountType } from '@prisma/client';

/**
 * Account type constants to avoid hardcoded strings
 *
 * Use these constants instead of string literals when comparing account types.
 * This is the ONLY place where AccountType string values should be defined.
 *
 * @example
 * import { ACCOUNT_TYPES } from '@/features/subscriptions/config';
 *
 * if (accountType === ACCOUNT_TYPES.FREE) { ... }
 */
export const ACCOUNT_TYPES = {
  FREE: 'FREE',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE',
} as const satisfies Record<AccountType, AccountType>;

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
 *
 * Note: TypeScript type expressions require literal types, so we use
 * ACCOUNT_TYPES.FREE here for clarity even though it resolves to 'FREE'
 */
export type PaidPlan = Exclude<AccountType, typeof ACCOUNT_TYPES.FREE>;

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
  [ACCOUNT_TYPES.FREE]: {
    price: 0,
    displayName: 'Starter',
    description: 'Para empezar tu negocio',
    currency: 'ARS',
    billingFrequency: 1,
  },
  [ACCOUNT_TYPES.PRO]: {
    price: 10000,
    displayName: 'Business',
    description: 'Para negocios en crecimiento',
    currency: 'ARS',
    billingFrequency: 1,
  },
  [ACCOUNT_TYPES.ENTERPRISE]: {
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
export const PAID_PLANS: PaidPlan[] = [ACCOUNT_TYPES.PRO, ACCOUNT_TYPES.ENTERPRISE];

/**
 * Default account type for fallbacks
 *
 * Use this constant when a user doesn't have a subscription yet.
 *
 * @example
 * const accountType = subscription?.accountType ?? DEFAULT_ACCOUNT_TYPE;
 */
export const DEFAULT_ACCOUNT_TYPE: AccountType = ACCOUNT_TYPES.FREE;

/**
 * Plan hierarchy for upgrade comparisons
 *
 * Higher number = higher tier plan.
 * Use canUpgradeTo() utility function for comparisons.
 */
export const PLAN_HIERARCHY: Record<AccountType, number> = {
  [ACCOUNT_TYPES.FREE]: 0,
  [ACCOUNT_TYPES.PRO]: 1,
  [ACCOUNT_TYPES.ENTERPRISE]: 2,
} as const;
