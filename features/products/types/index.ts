/**
 * Product Types Index
 *
 * Barrel export for all product-related type definitions.
 */

export type {
  // Input types
  CreateProductInput,
  UpdateProductInput,
  GetProductsFilters,
  AttributeInput,
  VariantInput,
  ImageInput,
  DigitalProductInput,
  InventoryInput,
  CreateFullProductInput,
  UpdateFullProductInput,

  // Response types
  PaginatedProducts,

  // Extended types with relationships
  ProductWithVariants,
  ProductWithAttributes,
  ProductWithAllRelations,

  // Page props types
  ProductListPageProps,

  // Component props types
  ProductDataTableProps,

  // Prisma types re-exports
  Product,
  ProductVariant,
  ProductImage,
  DigitalProduct,
  ProductAttribute,
  ProductAttributeValue,
  ProductStatus,
  AttributeType,
} from '@/features/products/types/product.types';
