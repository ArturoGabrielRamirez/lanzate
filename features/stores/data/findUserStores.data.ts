/**
 * Find User Stores Data Function
 *
 * Pure database operation to retrieve all stores owned by a user.
 * Does NOT contain business logic - only database interaction.
 *
 * @param userId - The ID of the user whose stores to retrieve
 * @returns Array of store records owned by the user
 *
 * @example
 * const stores = await findUserStoresData('user-id-123');
 * console.log(stores.length); // Number of stores owned by user
 */
import type { Store } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function findUserStoresData(userId: string): Promise<Store[]> {
  const stores = await prisma.store.findMany({
    where: {
      ownerId: userId,
    },
  });

  return stores;
}
