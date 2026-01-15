import type { AccountType } from '@prisma/client';

/**
 * Account limits configuration type
 */
export interface AccountLimits {
  stores: number;
}

/**
 * Centralized account limits configuration
 *
 * Defines resource limits for each account type (FREE, PRO, ENTERPRISE).
 * All limit checks across the application should reference this config
 * to ensure consistency.
 *
 * @example
 * import { ACCOUNT_LIMITS } from '@/features/subscriptions/config';
 *
 * const storeLimit = ACCOUNT_LIMITS.FREE.stores; // 2
 * const isUnlimited = ACCOUNT_LIMITS.ENTERPRISE.stores === Infinity; // true
 */
export const ACCOUNT_LIMITS: Record<AccountType, AccountLimits> = {
  FREE: {
    stores: 2,
  },
  PRO: {
    stores: 5,
  },
  ENTERPRISE: {
    stores: Infinity,
  },
} as const;
