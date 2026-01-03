/**
 * Update User Data Function
 *
 * Pure database operation to update a user record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param id - The user ID to update
 * @param data - The fields to update
 * @returns The updated user record
 *
 * @example
 * const user = await updateUserData('cuid123', {
 *   email: 'newemail@example.com'
 * });
 */
import type { UpdateUserParams } from '@/features/auth/types';
import { prisma } from '@/lib/prisma';

export async function updateUserData(id: string, data: UpdateUserParams) {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return user;
}
