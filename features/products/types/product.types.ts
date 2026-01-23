/**
 * Product Types
 *
 * Type definitions for product data layer functions.
 * Uses Prisma types directly for consistency and type safety.
 */

import type {
  ProductBasicInfoInput,
} from '@/features/products/schemas/index';

import type {
  Product,
  ProductVariant,
  ProductImage,
  DigitalProduct,
  ProductAttribute,
  ProductAttributeValue,
  ProductStatus,
  AttributeType,
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
 * Service layer input types
 * These are used by service functions to create complete products
 */

export interface AttributeInput {
  name: string;
  type: AttributeType;
  values: string[];
}

export interface VariantInput {
  sku: string;
  price: number;
  promotionalPrice?: number;
  cost?: number;
  attributeValueIds?: string[];
}

export interface ImageInput {
  url: string;
  altText?: string;
  position: number;
  isPrimary: boolean;
}

export interface DigitalProductInput {
  downloadUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  expirationDate?: Date;
  downloadLimit?: number;
}

export interface InventoryInput {
  variantSku: string;
  branchId: string;
  quantity: number;
  lowStockThreshold?: number;
}

export interface CreateFullProductInput {
  basicInfo: ProductBasicInfoInput;
  storeId: string;
  attributes?: AttributeInput[];
  variants?: VariantInput[];
  images?: ImageInput[];
  digitalProduct?: DigitalProductInput;
  inventory?: InventoryInput[];
}

export interface UpdateFullProductInput {
  basicInfo?: Partial<ProductBasicInfoInput>;
  attributes?: AttributeInput[];
  variants?: VariantInput[];
  images?: ImageInput[];
  digitalProduct?: DigitalProductInput;
  inventory?: InventoryInput[];
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
 * Page Props Types
 * Props for product page components
 */

/**
 * Props for ProductListPage component
 *
 * Page props for the store products listing route
 * Route: /app/[locale]/(private)/stores/[subdomain]/products
 */
export interface ProductListPageProps {
  params: Promise<{ subdomain: string; locale: string }>;
}

/**
 * Component Props Types
 * Props for product-related components
 */

/**
 * Props for ProductDataTable component
 *
 * Client component that displays products in a data table format
 * with sorting, filtering, and pagination support.
 */
export interface ProductDataTableProps {
  /** Initial product data loaded from server */
  initialData: Product[];
  /** Total number of products for pagination */
  totalItems: number;
  /** Store ID for fetching more products */
  storeId: string;
}

/**
 * Props for ProductCard component
 *
 * Card displaying a product with image, name, price, and cart button.
 */
export interface ProductCardProps {
  product: Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  };
  storeSubdomain: string;
}

/**
 * Props for ProductGrid component
 *
 * Responsive grid layout for displaying product cards.
 */
export interface ProductGridProps {
  products: (Product & {
    images?: ProductImage[];
    variants?: ProductVariant[];
  })[];
  storeSubdomain: string;
  emptyMessage?: string;
}

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
  AttributeType,
};
