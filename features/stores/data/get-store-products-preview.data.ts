/**
 * Get Store Products Preview Data Function
 *
 * Pure database operation to retrieve products with images and variants
 * for display on the store detail page preview.
 */

import type { Product, ProductImage, ProductVariant } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
};

/**
 * Fetches products with their images and variants for store preview
 *
 * @param storeId - The store ID to fetch products for
 * @param limit - Maximum number of products to return (default 10)
 * @returns Array of products with images and variants
 */
export async function getStoreProductsPreviewData(
  storeId: string,
  limit: number = 10
): Promise<ProductWithRelations[]> {
  return prisma.product.findMany({
    where: {
      storeId,
      status: 'ACTIVE',
    },
    include: {
      images: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
