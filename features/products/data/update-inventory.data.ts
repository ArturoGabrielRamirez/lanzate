import type { UpdateInventoryInput } from '@/features/products/types';
import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to upsert inventory
 * @param data - Inventory update data
 * @returns Updated VariantInventory
 */
export async function updateInventoryData(data: UpdateInventoryInput) {
  return await prisma.variantInventory.upsert({
    where: {
      variantId_branchId: {
        variantId: data.variantId,
        branchId: data.branchId,
      },
    },
    update: {
      quantity: data.quantity,
      lowStockThreshold: data.lowStockThreshold,
    },
    create: {
      variantId: data.variantId,
      branchId: data.branchId,
      quantity: data.quantity,
      lowStockThreshold: data.lowStockThreshold,
    },
    include: {
      variant: true,
      branch: true,
    },
  });
}
