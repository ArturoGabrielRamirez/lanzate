'use server';

import { headers } from 'next/headers';

import { AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from '@/features/auth/schemas/auth.schema';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Password Reset Request Server Action
 *
 * Sends a password reset email to the user via Supabase Auth.
 * The email contains a link to the password reset form.
 *
 * Flow:
 * 1. Validate email with resetPasswordRequestSchema
 * 2. Extract host from headers to build redirect URL
 * 3. Create Supabase client
 * 4. Send reset email via Supabase resetPasswordForEmail
 * 5. Return success response
 *
 * Security Note:
 * - Always returns success even if email doesn't exist in system
 * - This prevents email enumeration attacks
 *
 * @param input - Password reset request form data (email only)
 * @returns ServerResponse indicating success or error
 *
 * @example
 * ```tsx
 * const result = await handleResetPasswordRequestAction({
 *   email: 'user@example.com'
 * });
 *
 * if (!result.hasError) {
 *   // Show confirmation page
 *   redirect('/reset-password/confirmation');
 * }
 * ```
 */
export async function handleResetPasswordRequestAction(
  input: ResetPasswordRequestInput
) {
  return actionWrapper(async () => {
    const validatedData = await resetPasswordRequestSchema.validate(input);

    const { email } = validatedData;

    const headersList = await headers();
    const host = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/reset-password/update`,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Always return success even if email doesn't exist
    // This prevents email enumeration attacks
    return formatSuccess(AUTH_SUCCESS_MESSAGES.PASSWORD_RESET_REQUEST, null);
  });
}
