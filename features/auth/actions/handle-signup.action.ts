'use server';

import { revalidatePath } from 'next/cache';

import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
import { signupSchema, type SignupInput } from '@/features/auth/schemas/auth.schema';
import { createUserService } from '@/features/auth/services';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Signup Server Action
 *
 * Handles user registration with email and password.
 * Creates both a Supabase auth user and a database user record.
 *
 * Flow:
 * 1. Validate input with signupSchema
 * 2. Create Supabase auth user
 * 3. Create database user via createUserService (auto-generates username)
 * 4. Revalidate /dashboard path
 * 5. Return success response
 *
 * @param input - Signup form data (email, password, confirmPassword)
 * @returns ServerResponse with user data or error
 *
 * @example
 * ```tsx
 * const result = await handleSignupAction({
 *   email: 'user@example.com',
 *   password: 'Password123',
 *   confirmPassword: 'Password123'
 * });
 *
 * if (!result.hasError) {
 *   // Signup successful, redirect to dashboard
 *   redirect('/dashboard');
 * }
 * ```
 */
export async function handleSignupAction(input: SignupInput) {
  return actionWrapper(async () => {
    const validatedData = await signupSchema.validate(input);

    const { email, password } = validatedData;

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error(AUTH_ERROR_MESSAGES.GENERIC_ERROR);
    }

    const dbUser = await createUserService({
      email,
      supabaseId: authData.user.id,
    });

    revalidatePath('/dashboard');

    return formatSuccess(AUTH_SUCCESS_MESSAGES.SIGNUP, {
      user: dbUser,
      authUser: authData.user,
    });
  });
}
