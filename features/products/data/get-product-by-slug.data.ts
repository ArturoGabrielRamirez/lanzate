/**
 * Get Product By Slug Data Function
 *
 * Pure database operation to retrieve a product by its slug within a store.
 * Used primarily for public storefront pages where products are accessed by URL.
 * Includes variants, images, digital product info, attributes, and aggregate counts.
 *
 * @param storeId - Store ID to search within
 * @param slug - Product slug (URL-friendly identifier)
 * @returns Product with all relations or null if not found
 *
 * @example
 * const product = await getProductBySlugData('store-123', 'my-product-slug');
 * if (product) {
 *   console.log(product.name);
 *   console.log(product.variants[0]?.price);
 * }
 */

import type { ProductWithAllRelations } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

export async function getProductBySlugData(
  storeId: string,
  slug: string
): Promise<ProductWithAllRelations | null> {
  const product = await prisma.product.findFirst({
    where: {
      storeId,
      slug,
      status: 'ACTIVE', // Only return active products for public access
    },
    include: {
      variants: {
        orderBy: { createdAt: 'asc' },
        include: {
          inventory: true,
        },
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

  return product as ProductWithAllRelations | null;
}
