/**
 * Product Components Index
 *
 * Barrel export for all product-related components.
 */

export { ProductDataTable } from '@/features/products/components/product-data-table';
export { ProductCard } from '@/features/products/components/product-card';
export { ProductGrid } from '@/features/products/components/product-grid';
export { ProductImageGallery } from '@/features/products/components/product-image-gallery';
export { VariantSelector } from '@/features/products/components/variant-selector';
export { ProductReviews } from '@/features/products/components/product-reviews';
export { ProductFilters } from '@/features/products/components/product-filters';
export { StorefrontHome } from '@/features/products/components/storefront-home';
export { ProductVariantSection } from '@/features/products/components/product-variant-section';

// Product List components (BaseCard-based)
export { ProductListContainer } from '@/features/products/components/product-list-container';
export { ProductCardRow } from '@/features/products/components/product-card-row';

// Create Product Form components
export {
  CreateProductProvider,
  useCreateProductContext,
} from '@/features/products/components/create-form';
