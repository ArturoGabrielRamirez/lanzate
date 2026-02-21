import { prisma } from '@/lib/prisma';

/**
 * Get user's store by userId
 *
 * @param userId - The user's ID
 * @returns Store with id, or null if not found
 */
export async function getUserStoreData(userId: string) {
  return await prisma.store.findFirst({
    where: {
      id: userId
    },
    select: { id: true },
  });
}
