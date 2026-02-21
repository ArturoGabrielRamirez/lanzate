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
  ProductListContainerProps,
  ProductCardRowProps,
  ProductCardProps,
  ProductGridProps,

  // Product list types
  ProductListSearchParams,
  ProductListFilters,
  CreateBundleInput,
  UpdateBundleInput,
  CreateBundleDataInput,
  UpdateInventoryInput,
  CreateReviewInput,
  CreateReviewDataInput,
  ProductBulkAction,

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

// Create Product Form types
export type {
  CreateProductBasicInfo,
  CreateProductMediaItem,
  CreateProductMedia,
  CreateProductOption,
  CreateProductOptionValue,
  CreateProductVariantForm,
  CreateProductVariants,
  CreateProductDigitalConfig,
  CreateProductPhysicalConfig,
  CreateProductConfigurations,
  CreateProductFormState,
  CreateProductStepValidation,
  CreateProductContextType,
  CreateProductProviderProps,
  CreateProductFormProps,
  CreateProductFormDialogProps,
  CreateProductFormContentProps,
} from '@/features/products/types/create-product-form.types';
