/**
 * Product Listing Types
 *
 * Type definitions for product listing page components and utilities.
 * Used for public product listing pages in the storefront.
 */

import type {
  Product,
  ProductStatus,
} from '@prisma/client';

/**
 * Props for ProductListingPage component
 *
 * Page props for product listing route
 * Route: /app/[locale]/s/[subdomain]/products/page.tsx
 */
export interface ProductListingPageProps {
  params: Promise<{ subdomain: string; locale: string }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

/**
 * Props for ProductFilters component
 *
 * Component for filtering products in the listing page
 */
export interface ProductFiltersProps {
  search: string;
  sort: string;
  status: string;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  isPending?: boolean;
  className?: string;
}

/**
 * Props for ProductSortSelect component
 *
 * Dropdown for sorting products
 */
export interface ProductSortSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Product listing filters
 */
export interface ProductListingFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: ProductStatus;
  isDigital?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'price';
  sortOrder?: 'asc' | 'desc';
  storeId?: string;
}

/**
 * Product with minimal relations for listing
 */
export type ProductWithBasicRelations = Product & {
  images?: {
    url: string;
    altText?: string;
    isPrimary: boolean;
  }[];
  variants?: {
    price: number;
    promotionalPrice?: number;
  }[];
};