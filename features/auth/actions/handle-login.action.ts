'use server';

import { revalidatePath } from 'next/cache';

import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
import { loginSchema, type LoginInput } from '@/features/auth/schemas/auth.schema';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Login Server Action
 *
 * Handles user authentication with email and password.
 * Authenticates via Supabase Auth.
 *
 * Flow:
 * 1. Validate input with loginSchema
 * 2. Sign in via Supabase Auth
 * 3. Revalidate /dashboard path
 * 4. Return success response
 *
 * @param input - Login form data (email, password)
 * @returns ServerResponse with auth user data or error
 *
 * @example
 * ```tsx
 * const result = await handleLoginAction({
 *   email: 'user@example.com',
 *   password: 'Password123'
 * });
 *
 * if (!result.hasError) {
 *   // Login successful, redirect to dashboard
 *   redirect('/dashboard');
 * }
 * ```
 */
export async function handleLoginAction(input: LoginInput) {
  return actionWrapper(async () => {
    const validatedData = await loginSchema.validate(input);

    const { email, password } = validatedData;

    const supabase = await createClient();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    revalidatePath('/dashboard');

    return formatSuccess(AUTH_SUCCESS_MESSAGES.LOGIN, {
      user: authData.user,
      session: authData.session,
    });
  });
}
