'use server';

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
 * Sends a password reset email to the user.
 * The email contains a link to reset their password.
 *
 * Flow:
 * 1. Validate input with resetPasswordRequestSchema
 * 2. Send reset email via Supabase Auth
 * 3. Return success response
 *
 * @param input - Password reset request data (email)
 * @returns ServerResponse indicating success or error
 *
 * @example
 * ```tsx
 * import { handleResetPasswordRequestAction } from '@/features/auth/actions/handleResetPasswordRequest.action';
 *
 * const result = await handleResetPasswordRequestAction({
 *   email: 'user@example.com'
 * });
 *
 * if (!result.hasError) {
 *   // Show "check your email" confirmation page
 *   redirect('/reset-password/confirmation');
 * }
 * ```
 */
export async function handleResetPasswordRequestAction(
  input: ResetPasswordRequestInput
) {
  return actionWrapper(async () => {
    // Validate input with Yup schema
    // This will throw ValidationError if invalid, caught by actionWrapper
    const validatedData = await resetPasswordRequestSchema.validate(input);

    const { email } = validatedData;

    // Create Supabase client
    const supabase = await createClient();

    // Send password reset email
    // The redirectTo URL should point to the password reset form page
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/update`,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Return success response
    return formatSuccess(
      'Password reset email sent. Please check your email.',
      null
    );
  });
}
