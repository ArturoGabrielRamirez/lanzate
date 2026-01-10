import type { AccountType } from '@prisma/client';

/**
 * Centralized account limits configuration
 *
 * Defines resource limits for each account type (FREE, PRO, ENTERPRISE).
 * All limit checks across the application should reference this config
 * to ensure consistency.
 *
 * @example
 * import { ACCOUNT_LIMITS } from '@/features/subscriptions/config/accountLimits';
 *
 * const storeLimit = ACCOUNT_LIMITS.FREE.stores; // 2
 * const isUnlimited = ACCOUNT_LIMITS.ENTERPRISE.stores === Infinity; // true
 */
export const ACCOUNT_LIMITS = {
  FREE: {
    stores: 2,
  },
  PRO: {
    stores: 5,
  },
  ENTERPRISE: {
    stores: Infinity,
  },
} as const satisfies Record<AccountType, { stores: number }>;

/**
 * Helper to get the store limit for an account type
 */
export function getStoreLimit(accountType: AccountType): number {
  return ACCOUNT_LIMITS[accountType].stores;
}

/**
 * Helper to check if a user has reached their store limit
 */
export function hasReachedStoreLimit(
  accountType: AccountType,
  currentStoreCount: number
): boolean {
  const limit = getStoreLimit(accountType);
  return currentStoreCount >= limit;
}
