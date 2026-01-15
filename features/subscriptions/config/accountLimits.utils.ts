
import { ACCOUNT_LIMITS } from '@/features/subscriptions/config/accountLimits.constants';

import type { AccountType } from '@prisma/client';
/**
 * Account limits utility functions
 *
 * Helper functions for checking account limits.
 *
 * @example
 * import { getStoreLimit, hasReachedStoreLimit } from '@/features/subscriptions/config';
 *
 * const limit = getStoreLimit('PRO'); // 5
 * const isAtLimit = hasReachedStoreLimit('FREE', 2); // true
 */

/**
 * Get the store limit for an account type
 */
export function getStoreLimit(accountType: AccountType): number {
  return ACCOUNT_LIMITS[accountType].stores;
}

/**
 * Check if a user has reached their store limit
 */
export function hasReachedStoreLimit(
  accountType: AccountType,
  currentStoreCount: number
): boolean {
  const limit = getStoreLimit(accountType);
  return currentStoreCount >= limit;
}
