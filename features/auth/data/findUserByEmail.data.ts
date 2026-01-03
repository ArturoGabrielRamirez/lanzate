/**
 * Find User By Email Data Function
 *
 * Pure database operation to find a user by email.
 * Does NOT contain business logic - only database interaction.
 *
 * @param email - The email address to search for
 * @returns The user record or null if not found
 *
 * @example
 * const user = await findUserByEmailData('user@example.com');
 * if (user) {
 *   console.log('User found:', user.id);
 * }
 */
import { prisma } from '@/lib/prisma';

export async function findUserByEmailData(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}
