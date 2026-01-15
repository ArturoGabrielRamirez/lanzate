/**
 * Store Stats Component Types
 *
 * Type definitions for the StoreStats component and related data fetching.
 */

import type { AccountType, Store } from '@prisma/client';

/**
 * Props for StoreStats component
 *
 * @property stores - Array of user's stores (max 2 for dashboard display)
 * @property accountType - User's account type for store limit checking
 * @property totalCount - Total number of stores (may be more than stores.length)
 */
export interface StoreStatsProps {
  stores: Store[];
  accountType: AccountType;
  totalCount: number;
}

/**
 * Response from getUserStoresAction
 */
export interface UserStoresData {
  stores: Store[];
  accountType: AccountType;
  totalCount: number;
}

/**
 * Props for StoreStatsSkeleton component
 */
export interface StoreStatsSkeletonProps {
  /** Number of skeleton cards to show */
  cardCount?: number;
}
