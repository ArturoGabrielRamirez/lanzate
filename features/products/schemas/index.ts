/**
 * Product Schemas Index
 *
 * This file provides clean exports for all product validation schemas
 * and field validators. It follows the barrel export pattern to
 * maintain clean imports throughout the application.
 *
 * Exports:
 * - Main schemas (productBasicInfoSchema, productMediaSchema, etc.)
 * - Field validators for reuse (nameField, priceField, etc.)
 * - Inferred TypeScript types for type safety
 */

// Re-export schemas
export {
  productBasicInfoSchema,
  productMediaSchema,
  productVariantSchema,
  productConfigSchema,
} from './product.schema';

// Re-export field validators for reuse
export {
  nameField,
  descriptionField,
  slugField,
  brandField,
  seoTitleField,
  seoDescriptionField,
  urlField,
  priceField,
  promotionalPriceField,
  skuField,
  productStatusField,
} from './productFields';

// Export inferred types
export type {
  ProductBasicInfoInput,
  ProductMediaInput,
  ProductVariantInput,
  ProductConfigInput,
} from './product.schema';