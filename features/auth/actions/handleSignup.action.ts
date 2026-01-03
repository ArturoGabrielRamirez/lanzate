'use server';

import { revalidatePath } from 'next/cache';

import { AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants/messages';
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
 * import { handleSignupAction } from '@/features/auth/actions/handleSignup.action';
 *
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
    // Validate input with Yup schema
    // This will throw ValidationError if invalid, caught by actionWrapper
    const validatedData = await signupSchema.validate(input);

    const { email, password } = validatedData;

    // Create Supabase client
    const supabase = await createClient();

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('No user returned from Supabase signup');
    }

    // Create database user record via service layer
    // Service layer auto-generates username from email
    const dbUser = await createUserService({
      email,
      supabaseId: authData.user.id,
    });

    // Revalidate dashboard path to ensure fresh data
    revalidatePath('/dashboard');

    // Return success response
    return formatSuccess(AUTH_SUCCESS_MESSAGES.SIGNUP.en, {
      user: dbUser,
      authUser: authData.user,
    });
  });
}
