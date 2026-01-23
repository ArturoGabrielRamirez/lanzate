/**
 * Count Store Branches Data Function
 *
 * Pure database operation to count branches for a store.
 */

import { prisma } from '@/lib/prisma';

/**
 * Counts the number of branches for a store
 *
 * @param storeId - The store ID to count branches for
 * @returns Number of branches
 */
export async function countStoreBranchesData(storeId: string): Promise<number> {
  return prisma.branch.count({
    where: { storeId },
  });
}
