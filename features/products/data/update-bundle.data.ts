import type { UpdateBundleInput } from '@/features/products/types';
import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to update bundle
 * @param data - Updated bundle data
 * @returns Updated ProductBundle
 */
export async function updateBundleData(data: UpdateBundleInput) {
  // Use transaction to delete existing items and create new ones atomically
  return await prisma.$transaction(async (tx) => {
    // Delete existing items
    await tx.bundleItem.deleteMany({
      where: { bundleId: data.id },
    });

    // Update bundle and create new items
    return await tx.productBundle.update({
      where: { id: data.id },
      data: {
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
  });
}
