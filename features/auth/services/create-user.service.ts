/**
 * Create User Service
 *
 * Business logic for creating a new user in the database.
 * - Auto-generates username from email
 * - Validates email uniqueness
 * - Creates user record
 *
 * @param params - User creation parameters
 * @returns The created user record
 * @throws Error if email already exists
 *
 * @example
 * const user = await createUserService({
 *   email: 'john@example.com',
 *   supabaseId: 'uuid-123'
 * });
 * // user.username will be 'john' (auto-generated)
 */
import { AUTH_ERROR_MESSAGES } from '@/features/auth/constants';
import { createUserData, findUserByEmailData } from '@/features/auth/data';
import type { CreateUserServiceParams } from '@/features/auth/types';
import { generateUsername } from '@/features/auth/utils';

export async function createUserService(params: CreateUserServiceParams) {
  const { email, supabaseId } = params;

  // Check if user already exists
  const existingUser = await findUserByEmailData(email);

  if (existingUser) {
    throw new Error(AUTH_ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  // Auto-generate username from email
  const username = generateUsername(email);

  // Create user in database
  const user = await createUserData({
    email,
    username,
    supabaseId,
  });

  return user;
}
