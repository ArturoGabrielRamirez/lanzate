/**
 * Create User Data Function
 *
 * Pure database operation to insert a new user record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param params - User creation parameters
 * @returns The created user record
 *
 * @example
 * const user = await createUserData({
 *   email: 'user@example.com',
 *   username: 'user',
 *   supabaseId: 'uuid-123'
 * });
 */
import type { CreateUserParams } from '@/features/auth/types';
import { prisma } from '@/lib/prisma';

export async function createUserData(params: CreateUserParams) {
  const { email, username, supabaseId } = params;

  const user = await prisma.user.create({
    data: {
      email,
      username,
      supabaseId,
    },
  });

  return user;
}
