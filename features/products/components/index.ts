/**
 * Product Components Index
 *
 * Barrel export for all product-related components.
 */

export { ProductDataTable } from '@/features/products/components/product-data-table';
export { ProductCard } from '@/features/products/components/product-card';
export { ProductGrid } from '@/features/products/components/product-grid';

// Create Product Form components
export {
  CreateProductProvider,
  useCreateProductContext,
} from '@/features/products/components/create-form';
