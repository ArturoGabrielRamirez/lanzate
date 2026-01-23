/**
 * Store Component Types
 *
 * Props interfaces for store-related components.
 */

import type { AccountType, Product, ProductImage, ProductVariant, Store } from '@prisma/client';

export interface StoreDetailProps {
  store: Store;
  products?: (Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  })[];
  productCount?: number;
  branchCount?: number;
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
