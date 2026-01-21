/**
 * Delete Product Data Function
 *
 * Pure database operation to delete a product.
 * Cascade deletes all related variants, images, and digital product data.
 *
 * @param productId - Product ID to delete
 * @returns Promise that resolves when deletion is complete
 *
 * @example
 * await deleteProductData('prod-123');
 * // Product and all related data is now deleted
 */

import { prisma } from '@/lib/prisma';

export async function deleteProductData(
  productId: string
): Promise<void> {
  await prisma.product.delete({
    where: { id: productId },
  });
}