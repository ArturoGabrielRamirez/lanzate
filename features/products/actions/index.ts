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
export { bulkUpdateProductsAction } from '@/features/products/actions/bulk-update-products.action';
export type { BulkProductOperation } from '@/features/products/types/product.types';

// Inventory actions
export { updateInventoryAction } from '@/features/products/actions/update-inventory.action';
export { getInventoryStatusAction } from '@/features/products/actions/get-inventory-status.action';

// Review actions
export { createReviewAction } from '@/features/products/actions/create-review.action';
export { getProductReviewsAction } from '@/features/products/actions/get-product-reviews.action';

// Bundle actions
export { createBundleAction } from '@/features/products/actions/create-bundle.action';
export { updateBundleAction } from '@/features/products/actions/update-bundle.action';
export { deleteBundleAction } from '@/features/products/actions/delete-bundle.action';
export { getBundlesAction } from '@/features/products/actions/get-bundles.action';

// Digital product actions
export { getDownloadUrlAction } from '@/features/products/actions/get-download-url.action';
