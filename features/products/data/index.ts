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
} from '@/features/products/types/product.types';
