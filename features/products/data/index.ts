/**
 * Product Data Functions Index
 *
 * Barrel export for all product data layer functions.
 * Provides clean imports for server actions and services.
 */

export { createProductData } from '@/features/products/data/create-product.data';
export { getProductsData } from '@/features/products/data/get-products.data';
export { getProductByIdData } from '@/features/products/data/get-product-by-id.data';
export { getProductBySlugData } from '@/features/products/data/get-product-by-slug.data';
export { updateProductData } from '@/features/products/data/update-product.data';
export { deleteProductData } from '@/features/products/data/delete-product.data';

// Inventory data
export { getInventoryData } from '@/features/products/data/get-inventory.data';
export { updateInventoryData } from '@/features/products/data/update-inventory.data';

// Review data
export { createReviewData } from '@/features/products/data/create-review.data';
export { getProductReviewsData } from '@/features/products/data/get-product-reviews.data';

// Bundle data
export { createBundleData } from '@/features/products/data/create-bundle.data';
export { updateBundleData } from '@/features/products/data/update-bundle.data';
export { deleteBundleData } from '@/features/products/data/delete-bundle.data';
export { getBundlesData } from '@/features/products/data/get-bundles.data';

// Digital product data
export { getDigitalProductData } from '@/features/products/data/get-digital-product.data';
export { incrementDownloadCountData } from '@/features/products/data/increment-download-count.data';

// Export types
export type {
  CreateProductInput,
  UpdateProductInput,
  GetProductsFilters,
  PaginatedProducts,
  ProductWithVariants,
  ProductWithAttributes,
  ProductWithAllRelations,
  Product,
  ProductVariant,
  ProductImage,
  DigitalProduct,
  ProductAttribute,
  ProductAttributeValue,
  ProductStatus,
  InventoryStatus,
  InventoryStatusResponse,
  CreateReviewInput,
  PaginatedReviews,
  CreateBundleInput,
  CreateBundleDataInput,
  UpdateBundleInput,
  GetDownloadUrlInput,
  DownloadUrlResponse,
} from '@/features/products/types/product.types';
