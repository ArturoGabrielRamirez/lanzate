'use server';

import { revalidatePath } from 'next/cache';

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
 * import { handleLoginAction } from '@/features/auth/actions/handleLogin.action';
 *
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
    // Validate input with Yup schema
    // This will throw ValidationError if invalid, caught by actionWrapper
    const validatedData = await loginSchema.validate(input);

    const { email, password } = validatedData;

    // Create Supabase client
    const supabase = await createClient();

    // Sign in with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authData.user) {
      throw new Error('No user returned from Supabase login');
    }

    // Revalidate dashboard path to ensure fresh data
    revalidatePath('/dashboard');

    // Return success response
    return formatSuccess('Login successful', {
      user: authData.user,
      session: authData.session,
    });
  });
}
