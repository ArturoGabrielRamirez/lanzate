/**
 * Product Services Index
 *
 * Barrel export for all product service layer functions.
 * Services contain business logic and orchestrate data layer operations.
 */

export { createProductService } from '@/features/products/services/create-product.service';
export { updateProductService } from '@/features/products/services/update-product.service';
export {
  deleteProductService,
  bulkDeleteProductsService,
  bulkUpdateProductStatusService,
} from '@/features/products/services/delete-product.service';

// Inventory services
export { updateInventoryService } from '@/features/products/services/update-inventory.service';
export { getInventoryStatusService } from '@/features/products/services/get-inventory-status.service';

// Review services
export { createReviewService } from '@/features/products/services/create-review.service';

// Bundle services
export { createBundleService } from '@/features/products/services/create-bundle.service';
export { updateBundleService } from '@/features/products/services/update-bundle.service';
export { deleteBundleService } from '@/features/products/services/delete-bundle.service';

// Digital product services
export { getDownloadUrlService } from '@/features/products/services/get-download-url.service';
