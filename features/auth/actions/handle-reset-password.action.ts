'use server';

import { AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/features/auth/schemas/auth.schema';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Password Reset Server Action
 *
 * Updates the user's password after they have clicked the reset link in their email.
 * This action is called from the password reset form page.
 *
 * Flow:
 * 1. Validate new password with resetPasswordSchema (password + confirmPassword)
 * 2. Create Supabase client
 * 3. Update password via Supabase Auth updateUser method
 * 4. Return success response
 *
 * Security Note:
 * - User must have a valid reset token in their session from the email link
 * - Token validation is handled automatically by Supabase
 *
 * @param input - Password reset form data (password, confirmPassword)
 * @returns ServerResponse indicating success or error
 *
 * @example
 * ```tsx
 * const result = await handleResetPasswordAction({
 *   password: 'NewPassword123',
 *   confirmPassword: 'NewPassword123'
 * });
 *
 * if (!result.hasError) {
 *   // Password reset successful, redirect to login
 *   redirect('/login');
 * }
 * ```
 */
export async function handleResetPasswordAction(input: ResetPasswordInput) {
  return actionWrapper(async () => {
    const validatedData = await resetPasswordSchema.validate(input);

    const { password } = validatedData;

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return formatSuccess(AUTH_SUCCESS_MESSAGES.PASSWORD_RESET, null);
  });
}
