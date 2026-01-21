import type { AccountType } from '@prisma/client';

/**
 * Account limits configuration type
 */
export interface AccountLimits {
  stores: number;
  productAttributes: number;
}

/**
 * Centralized account limits configuration
 *
 * Defines resource limits for each account type (FREE, PRO, ENTERPRISE).
 * All limit checks across the application should reference this config
 * to ensure consistency.
 *
 * Limits:
 * - stores: Maximum number of stores a user can create
 * - productAttributes: Maximum number of custom attributes per product
 *
 * @example
 * import { ACCOUNT_LIMITS } from '@/features/subscriptions/config';
 *
 * const storeLimit = ACCOUNT_LIMITS.FREE.stores; // 2
 * const attrLimit = ACCOUNT_LIMITS.FREE.productAttributes; // 5
 * const isUnlimited = ACCOUNT_LIMITS.ENTERPRISE.stores === Infinity; // true
 */
export const ACCOUNT_LIMITS: Record<AccountType, AccountLimits> = {
  FREE: {
    stores: 2,
    productAttributes: 5,
  },
  PRO: {
    stores: 5,
    productAttributes: 50,
  },
  ENTERPRISE: {
    stores: Infinity,
    productAttributes: Infinity,
  },
} as const;
