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
