/**
 * Delete Product Service
 *
 * Business logic for deleting a product.
 * Prisma handles cascade deletion of related data (variants, images, etc.)
 * based on the schema configuration.
 *
 * @param productId - The ID of the product to delete
 * @param storeId - The store ID (for ownership validation)
 * @returns void
 * @throws Error if product not found or doesn't belong to store
 */

import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import {
  checkProductOwnershipData,
  bulkDeleteProductsData,
  bulkUpdateProductStatusData,
} from '@/features/products/data';
import { prisma } from '@/lib/prisma'; // Still needed for single delete? Actually I should create deleteProductData if not exists.

/**
 * Delete Product Service
 *
 * Business logic for deleting a product.
 *
 * @param productId - The ID of the product to delete
 * @param storeId - The store ID (for ownership validation)
 */
export async function deleteProductService(
  productId: string,
  storeId: string
): Promise<void> {
  // Verify product exists and belongs to the store via data layer
  const product = await checkProductOwnershipData(productId, storeId);

  if (!product) {
    throw new Error(PRODUCT_ERROR_MESSAGES.DELETE_PERMISSION_DENIED);
  }

  // Delete the product (cascades to variants, images, etc. via Prisma schema)
  await prisma.product.delete({
    where: { id: productId },
  });
}

/**
 * Bulk Delete Products Service
 */
export async function bulkDeleteProductsService(
  productIds: string[],
  storeId: string
): Promise<number> {
  const result = await bulkDeleteProductsData(productIds, storeId);
  return result.count;
}

/**
 * Bulk Update Product Status Service
 */
export async function bulkUpdateProductStatusService(
  productIds: string[],
  storeId: string,
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
): Promise<number> {
  const result = await bulkUpdateProductStatusData(productIds, storeId, status);
  return result.count;
}
