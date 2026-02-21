/**
 * Storefront Feature Types
 *
 * Type definitions for public-facing storefront components.
 * Separate from features/products (merchant dashboard types).
 */

import type { StoreTheme } from '@/features/stores/types';

import type { Store } from '@prisma/client';

/**
 * Props for StorefrontLayout component
 */
export interface StorefrontLayoutProps {
    store: Store;
    theme: StoreTheme;
    children: React.ReactNode;
}

/**
 * Props for StorefrontHeader component
 */
export interface StorefrontHeaderProps {
    store: Store;
    theme: StoreTheme;
}

/**
 * Props for StorefrontFooter component
 */
export interface StorefrontFooterProps {
    store: Store;
}

/**
 * Minimal product shape needed by storefront card/grid
 * (avoids importing heavy full product type from merchant layer)
 */
export interface StorefrontProduct {
    id: string;
    name: string;
    slug: string;
    isNew: boolean;
    isOnSale: boolean;
    isFeatured: boolean;
    images: Array<{
        url: string;
        altText: string | null;
        isPrimary: boolean;
    }>;
    variants: Array<{
        price: number | string;
        promotionalPrice: number | string | null;
    }>;
}

/**
 * Props for StorefrontProductCard component
 */
export interface StorefrontProductCardProps {
    product: StorefrontProduct;
    storeSubdomain: string;
}

/**
 * Props for StorefrontProductGrid component
 */
export interface StorefrontProductGridProps {
    products: StorefrontProduct[];
    storeSubdomain: string;
    emptyMessage?: string;
}

/**
 * Props for StorefrontProductListContainer component (Client Component)
 */
export interface StorefrontProductListContainerProps {
    initialProducts: StorefrontProduct[];
    totalPages: number;
    totalCount: number;
    storeSubdomain: string;
    initialSearch?: string;
    initialSort?: string;
    initialPage?: number;
}

/**
 * Props for Storefront Product Listing Page
 */
export interface ProductListingPageProps {
    params: Promise<{ subdomain: string; locale: string }>;
    searchParams: Promise<{
        search?: string;
        sort?: string;
        page?: string;
    }>;
}
