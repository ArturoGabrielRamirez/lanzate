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

import { prisma } from '@/lib/prisma';

export async function deleteProductService(
  productId: string,
  storeId: string
): Promise<void> {
  // Verify product exists and belongs to the store
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId,
    },
    select: { id: true },
  });

  if (!product) {
    throw new Error('Producto no encontrado o no tienes permiso para eliminarlo.');
  }

  // Delete the product (cascades to variants, images, etc. via Prisma schema)
  await prisma.product.delete({
    where: { id: productId },
  });
}

/**
 * Bulk Delete Products Service
 *
 * Deletes multiple products at once.
 *
 * @param productIds - Array of product IDs to delete
 * @param storeId - The store ID (for ownership validation)
 * @returns Number of deleted products
 */
export async function bulkDeleteProductsService(
  productIds: string[],
  storeId: string
): Promise<number> {
  // Delete products that belong to the store
  const result = await prisma.product.deleteMany({
    where: {
      id: { in: productIds },
      storeId,
    },
  });

  return result.count;
}

/**
 * Bulk Update Product Status Service
 *
 * Updates the status of multiple products at once.
 *
 * @param productIds - Array of product IDs to update
 * @param storeId - The store ID (for ownership validation)
 * @param status - The new status to set
 * @returns Number of updated products
 */
export async function bulkUpdateProductStatusService(
  productIds: string[],
  storeId: string,
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
): Promise<number> {
  const result = await prisma.product.updateMany({
    where: {
      id: { in: productIds },
      storeId,
    },
    data: { status },
  });

  return result.count;
}
