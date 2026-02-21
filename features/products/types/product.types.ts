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
  ProductReview,
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

/**
 * Product shape for list views (admin/storefront)
 */
export type ProductListItem = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
};

export interface PaginatedProducts {
  data: ProductListItem[];
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

export interface UpdateInventoryInput {
  variantId: string;
  branchId: string;
  quantity: number;
  lowStockThreshold: number;
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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
 * Props for ProductListContainer component
 *
 * Client component that displays products using BaseCard in row layout
 * with nuqs URL state management for search, filters, and pagination.
 */
export interface ProductListContainerProps {
  /** Initial product data loaded from server */
  products: ProductListItem[];
  /** Total number of products for pagination */
  total: number;
  /** Store ID for the current store */
  storeId: string;
  /** Store subdomain for navigation */
  subdomain: string;
}

/**
 * Props for ProductCardRow component
 *
 * Single product row using BaseCard with layout="row".
 * Displays product info with checkbox for bulk selection.
 */
export interface ProductCardRowProps {
  /** Product data to display */
  product: ProductListItem;
  /** Whether this product is selected for bulk actions */
  isSelected: boolean;
  /** Callback when selection checkbox is toggled */
  onToggleSelect: (productId: string) => void;
  /** Store subdomain for navigation */
  subdomain: string;
}

/**
 * Product List Search Params Type
 *
 * Type for nuqs parsers used in ProductListContainer
 */
export interface ProductListSearchParams {
  search: string;
  status: ProductStatus | null;
  sort: 'name' | 'createdAt' | 'updatedAt' | 'price' | 'stock';
  page: number;
  pageSize: number;
}

/**
 * Product List Filters Type
 *
 * Type for filter state in ProductListContainer
 */
export interface ProductListFilters {
  search: string;
  status: ProductStatus | null;
  sort: 'name' | 'createdAt' | 'updatedAt' | 'price' | 'stock';
}

/**
 * Product Bulk Actions Type
 *
 * Type for bulk action operations
 */
export type ProductBulkAction = 'delete' | 'archive' | 'activate' | 'draft';

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
 * Inventory Types
 */

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryStatusResponse {
  status: InventoryStatus;
  quantity: number;
  lowStockThreshold: number;
}

/**
 * Review Types
 */

export interface CreateReviewInput {
  productId: string;
  orderItemId: string;
  rating: number;
  title: string;
  body?: string;
}

export interface CreateReviewDataInput extends CreateReviewInput {
  userId: string;
  orderId: string;
}

/**
 * Review with user relation
 */
export type ProductReviewWithUser = ProductReview & {
  user: {
    username: string;
    email: string;
  };
};

export interface PaginatedReviews {
  reviews: ProductReviewWithUser[];
  total: number;
  averageRating: number;
  page: number;
  limit: number;
}

/**
 * Bundle Types
 */

export interface CreateBundleInput {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}

export interface CreateBundleDataInput extends CreateBundleInput {
  storeId: string;
}

export interface UpdateBundleInput extends CreateBundleInput {
  id: string;
}

/**
 * Digital Product Types
 */

export interface GetDownloadUrlInput {
  productId: string;
  orderItemId: string;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  downloadsRemaining?: number;
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
  ProductReview,
};
