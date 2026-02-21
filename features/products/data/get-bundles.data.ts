import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to get store bundles
 * @param storeId - Store ID
 * @returns All bundles for store with items
 */
export async function getBundlesData(storeId: string) {
  return await prisma.productBundle.findMany({
    where: { storeId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
