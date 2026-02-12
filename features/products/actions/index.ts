/**
 * Product Actions Index
 *
 * Barrel export for all product server actions.
 * These actions handle HTTP requests and call the service layer.
 */

export { createProductAction } from '@/features/products/actions/create-product.action';
export { getProductsAction } from '@/features/products/actions/get-products.action';
export { getProductByIdAction } from '@/features/products/actions/get-product-by-id.action';
export { getProductBySlugAction } from '@/features/products/actions/get-product-by-slug.action';
export { updateProductAction } from '@/features/products/actions/update-product.action';
export { deleteProductAction } from '@/features/products/actions/delete-product.action';
export {
  bulkUpdateProductsAction,
  type BulkProductOperation,
} from '@/features/products/actions/bulk-update-products.action';
