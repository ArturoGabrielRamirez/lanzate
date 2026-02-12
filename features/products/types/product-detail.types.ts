/**
 * Product Detail Types
 *
 * Type definitions for product detail page components and utilities.
 * Used for public product pages in the storefront.
 */

import type {
  Product,
  ProductVariant,
  ProductImage,
  ProductReview,
  ProductAttribute,
  ProductAttributeValue,
} from '@prisma/client';
import type { ProductWithAllRelations } from './product.types';

/**
 * Props for ProductDetailPage component
 *
 * Page props for product detail route
 * Route: /app/[locale]/s/[subdomain]/products/[slug]/page.tsx
 */
export interface ProductDetailPageProps {
  params: Promise<{ subdomain: string; slug: string; locale: string }>;
}

/**
 * Product type for detail page
 * Uses ProductWithAllRelations which includes all necessary relations
 */
export type ProductDetail = ProductWithAllRelations;

/**
 * Props for ProductImageGallery component
 *
 * Client component for displaying product images with zoom functionality
 */
export interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

/**
 * Variant with relations for selector
 */
export type VariantWithRelations = ProductVariant & {
  attributeValues: {
    attribute: {
      name: string;
      type: 'TEXT' | 'NUMBER' | 'COLOR' | 'IMAGE';
    };
    value: string;
  }[];
  inventory?: {
    quantity: number;
    lowStockThreshold: number;
  }[];
};

/**
 * Props for VariantSelector component
 *
 * Client component for selecting product variants
 */
export interface VariantSelectorProps {
  variants: VariantWithRelations[];
  onVariantChange: (variant: ProductVariant) => void;
  className?: string;
}

/**
 * Grouped variant options for display
 */
export interface VariantAttributeGroup {
  attributeName: string;
  attributeType: 'TEXT' | 'NUMBER' | 'COLOR' | 'IMAGE';
  values: string[];
}

/**
 * Props for VariantOption component
 *
 * Individual option within variant selector
 */
export interface VariantOptionProps {
  value: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  type?: 'TEXT' | 'NUMBER' | 'COLOR' | 'IMAGE';
}

/**
 * Props for ProductReviews component
 *
 * Component for displaying product reviews
 */
export interface ProductReviewsProps {
  productId: string;
  initialReviews?: ProductReview[];
  averageRating?: number;
  totalReviews?: number;
  className?: string;
}

/**
 * Props for ReviewSummary component
 *
 * Shows average rating and review count
 */
export interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  className?: string;
}

/**
 * Props for ProductDetailContent component
 *
 * Main content component for product detail page
 */
export interface ProductDetailContentProps {
  product: ProductDetail;
  storeSubdomain: string;
}

/**
 * Props for ProductActions component
 *
 * Component for product actions (add to cart, buy now, etc.)
 */
export interface ProductActionsProps {
  selectedVariant: ProductVariant;
  productId: string;
  isDigital: boolean;
  inStock: boolean;
  className?: string;
}