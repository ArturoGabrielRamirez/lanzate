/**
 * Update User Profile Service
 *
 * Business logic for updating user profile information.
 * Updates email and/or password via Supabase Auth and database.
 *
 * @param userId - The user ID to update
 * @param params - Profile update parameters
 * @returns The updated user record
 * @throws Error if update fails
 *
 * @example
 * const user = await updateUserProfileService('user-id', {
 *   email: 'newemail@example.com',
 *   password: 'NewSecurePass123'
 * });
 */
import { updateUserData } from '@/features/auth/data';
import type { UpdateUserProfileParams } from '@/features/auth/types';
import { createClient } from '@/lib/supabase/server';

export async function updateUserProfileService(userId: string,params: UpdateUserProfileParams) {
  
  const { email, password } = params;
  const supabase = await createClient();

  // Prepare Supabase auth update data
  const authUpdateData: { email?: string; password?: string } = {};

  if (email) {
    authUpdateData.email = email;
  }

  if (password) {
    authUpdateData.password = password;
  }

  // Update Supabase auth user
  if (Object.keys(authUpdateData).length > 0) {
    const { error } = await supabase.auth.updateUser(authUpdateData);

    if (error) {
      throw new Error(`Failed to update auth user: ${error.message}`);
    }
  }

  // Update database record if email changed
  if (email) {
    const user = await updateUserData(userId, { email });
    return user;
  }

  // If only password was updated, just return null or fetch the user
  // For now, return null as password updates don't affect the database
  return null;
}
