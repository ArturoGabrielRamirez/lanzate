import type { CreateBundleDataInput } from '@/features/products/types';
import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to create bundle with items
 * @param data - Bundle data with items
 * @returns Created ProductBundle with items
 */
export async function createBundleData(data: CreateBundleDataInput) {
  return await prisma.productBundle.create({
    data: {
      storeId: data.storeId,
      name: data.name,
      description: data.description,
      price: data.price,
      isActive: data.isActive,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });
}
