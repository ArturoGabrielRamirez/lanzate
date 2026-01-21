/**
 * Product Types
 *
 * Type definitions for product data layer functions.
 * Uses Prisma types directly for consistency and type safety.
 */

import type { ProductBasicInfoInput } from '@/features/products/schemas/index';

import type {
  Product,
  ProductVariant,
  ProductImage,
  DigitalProduct,
  ProductAttribute,
  ProductAttributeValue,
  ProductStatus,
} from '@prisma/client';

/**
 * Input types for data operations
 */

export interface CreateProductInput {
  basicInfo: ProductBasicInfoInput;
  storeId: string;
}

// Use Partial of ProductBasicInfoInput for update operations
export type UpdateProductInput = Partial<ProductBasicInfoInput>;

export interface GetProductsFilters {
  storeId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ProductStatus;
  isDigital?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response types
 */

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Extended types with relationships
 * Using Prisma types directly with includes
 */

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
  images: ProductImage[];
  digitalProduct: DigitalProduct | null;
};

export type ProductWithAttributes = Product & {
  attributes: (ProductAttribute & {
    values: ProductAttributeValue[];
  })[];
};

export type ProductWithAllRelations = Product & {
  variants: ProductVariant[];
  images: ProductImage[];
  digitalProduct: DigitalProduct | null;
  attributes: (ProductAttribute & {
    values: ProductAttributeValue[];
  })[];
  _count: {
    variants: number;
    images: number;
    reviews: number;
  };
};

/**
 * Re-export Prisma types for convenience
 */
export type {
  Product,
  ProductVariant,
  ProductImage,
  DigitalProduct,
  ProductAttribute,
  ProductAttributeValue,
  ProductStatus,
};
