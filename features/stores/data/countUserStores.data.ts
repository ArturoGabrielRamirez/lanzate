/**
 * Count User Stores Data Function
 *
 * Pure database operation to count the number of stores owned by a user.
 * Does NOT contain business logic - only database interaction.
 *
 * @param userId - The ID of the user whose stores to count
 * @returns The number of stores owned by the user
 *
 * @example
 * const count = await countUserStoresData('user-id-123');
 * console.log(`User has ${count} stores`);
 */
import { prisma } from '@/lib/prisma';

export async function countUserStoresData(userId: string): Promise<number> {
  const count = await prisma.store.count({
    where: {
      ownerId: userId,
    },
  });

  return count;
}
