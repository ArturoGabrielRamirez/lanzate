/**
 * Store Component Types
 *
 * Props interfaces for store-related components.
 */


import type { AccountType, Product, ProductImage, ProductReview, ProductVariant, Store } from '@prisma/client';
import type { LucideIcon } from 'lucide-react';

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

export interface StoreHeaderBarProps {
  subdomain: string;
}

export interface StoreHeaderVisualProps {
  store: Store;
  isOwner?: boolean;
}

export interface AdminPanelSectionProps {
  subdomain: string;
  productCount: number;
  branchCount: number;
}

export interface AdminCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  subtitle: string;
  href?: string;
  disabled?: boolean;
}

export interface StoreConfigLinkProps {
  subdomain: string;
}

export interface StoreTabsProps {
  storeSubdomain: string;
  products: (Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  })[];
  reviews?: (ProductReview & {
    user?: {
      name: string | null;
      image: string | null;
    };
  })[];
}

export interface ReviewCardProps {
  review: ProductReview & {
    user?: {
      name: string | null;
      image: string | null;
    };
  };
}
