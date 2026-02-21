'use server';

import { revalidatePath } from 'next/cache';

import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
import { getUserBySupabaseId } from '@/features/auth/data';
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from '@/features/auth/schemas/auth.schema';
import { updateUserProfileService } from '@/features/auth/services';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Update Profile Server Action
 *
 * Updates the user's profile information including email and/or password.
 * Updates both Supabase Auth and the database record.
 *
 * Flow:
 * 1. Validate input with updateProfileSchema
 * 2. Get current authenticated user from Supabase
 * 3. Fetch database user via getUserBySupabaseId
 * 4. Update via updateUserProfileService (handles Supabase and database)
 * 5. Revalidate /profile path
 * 6. Return success response
 *
 * Security:
 * - User must be authenticated
 * - At least one field (email or password) must be provided
 * - Password must meet strength requirements if provided
 *
 * @param input - Profile update data (email?, password?, confirmPassword?)
 * @returns ServerResponse with updated user data or error
 *
 * @example
 * ```tsx
 * // Update only email
 * const result = await updateProfileAction({
 *   email: 'newemail@example.com'
 * });
 *
 * // Update only password
 * const result = await updateProfileAction({
 *   password: 'NewPassword123',
 *   confirmPassword: 'NewPassword123'
 * });
 *
 * if (!result.hasError) {
 *   // Profile updated successfully
 *   console.log('Updated user:', result.payload?.user);
 * }
 * ```
 */
export async function updateProfileAction(input: UpdateProfileInput) {
  return actionWrapper(async () => {
    const validatedData = await updateProfileSchema.validate(input);

    const { email, password } = validatedData;

    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error(AUTH_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const dbUser = await getUserBySupabaseId(authUser.id);

    const updateParams: { email?: string; password?: string } = {};

    if (email) {
      updateParams.email = email;
    }

    if (password) {
      updateParams.password = password;
    }

    const updatedUser = await updateUserProfileService(
      dbUser.id,
      updateParams
    );

    revalidatePath('/profile');

    return formatSuccess(AUTH_SUCCESS_MESSAGES.PROFILE_UPDATE, {
      user: updatedUser,
      authUser,
    });
  });
}
