import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to get inventory record
 * @param variantId - The variant ID
 * @param branchId - The branch ID
 * @returns VariantInventory or null
 */
export async function getInventoryData(variantId: string, branchId: string) {
  return await prisma.variantInventory.findUnique({
    where: {
      variantId_branchId: {
        variantId,
        branchId,
      },
    },
    include: {
      variant: true,
      branch: true,
    },
  });
}
