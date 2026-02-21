/**
 * Count Store Active Products Data Function
 *
 * Pure database operation to count active products for a store.
 */

import { prisma } from '@/lib/prisma';

/**
 * Counts the number of active products for a store
 *
 * @param storeId - The store ID to count products for
 * @returns Number of active products
 */
export async function countStoreActiveProductsData(storeId: string): Promise<number> {
  return prisma.product.count({
    where: { storeId, status: 'ACTIVE' },
  });
}
