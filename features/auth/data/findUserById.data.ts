/**
 * Find User By ID Data Function
 *
 * Pure database operation to find a user by their ID.
 * Does NOT contain business logic - only database interaction.
 *
 * @param id - The user ID to search for
 * @returns The user record or null if not found
 *
 * @example
 * const user = await findUserByIdData('cuid123');
 * if (user) {
 *   console.log('User found:', user.email);
 * }
 */
import { prisma } from '@/lib/prisma';

export async function findUserByIdData(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
}
