/**
 * Store Card Types
 *
 * Props interfaces for store card components used in grids/lists.
 */

import type { AccountType, Store } from '@prisma/client';

/**
 * Props for StoreCard component
 *
 * Individual store card with animation support.
 */
export interface StoreCardProps {
  /** Store data to display */
  store: Store;
  /** Index for staggered animation (optional) */
  index?: number;
  /** Delay multiplier for animation (default: 0.1) */
  animationDelay?: number;
}

/**
 * Props for NewStoreCard component
 *
 * Card for creating a new store, with access control.
 */
export interface NewStoreCardProps {
  /** Current number of stores user has */
  currentStoreCount: number;
  /** User's account type for limit checking */
  accountType: AccountType;
  /** Index for staggered animation (optional) */
  index?: number;
  /** Delay multiplier for animation (default: 0.1) */
  animationDelay?: number;
}

/**
 * Props for StoresGrid component
 *
 * Grid container that composes StoreCard and NewStoreCard.
 */
export interface StoresGridProps {
  /** Array of stores to display */
  stores: Store[];
  /** User's account type */
  accountType: AccountType;
  /** Total count of stores (may differ from stores.length if paginated) */
  totalCount: number;
  /** Delay multiplier for animations (default: 0.1) */
  animationDelay?: number;
  /** Whether to show the "new store" card (default: true) */
  showNewStoreCard?: boolean;
}
