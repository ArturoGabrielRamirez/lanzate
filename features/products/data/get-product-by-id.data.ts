/**
 * Get Product By ID Data Function
 *
 * Pure database operation to retrieve a product with all relationships.
 * Includes variants, images, digital product info, attributes, and aggregate counts.
 *
 * @param productId - Product ID to retrieve
 * @returns Product with all relations or null if not found
 *
 * @example
 * const product = await getProductByIdData('prod-123');
 * if (product) {
 *   console.log(product.variants.length);
 *   console.log(product.digitalProduct?.fileName);
 * }
 */

import type { ProductWithAllRelations } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

export async function getProductByIdData(
  productId: string
): Promise<ProductWithAllRelations | null> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: {
        orderBy: { createdAt: 'asc' },
      },
      images: {
        orderBy: { position: 'asc' },
      },
      digitalProduct: true,
      attributes: {
        include: {
          values: true,
        },
      },
      _count: {
        select: {
          variants: true,
          images: true,
          reviews: true,
        },
      },
    },
  });

  return product;
}
