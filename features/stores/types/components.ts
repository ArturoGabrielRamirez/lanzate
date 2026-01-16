/**
 * Store Component Types
 *
 * Props interfaces for store-related components.
 */

import type { AccountType, Store } from '@prisma/client';

export interface StoreDetailProps {
  store: Store;
}

export interface StoresListProps {
  stores: Store[];
  accountType: AccountType;
  totalCount: number;
}

export interface StoresListSkeletonProps {
  cardCount?: number;
}

export interface DeleteStoreButtonProps {
  store: Store;
}
