'use server';

import { revalidatePath } from 'next/cache';

import { AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Logout Server Action
 *
 * Clears the user's Supabase session and logs them out of the application.
 * After successful logout, the user is redirected to the home page (/).
 *
 * Flow:
 * 1. Create Supabase client
 * 2. Sign out the current user
 * 3. Revalidate root path (/)
 * 4. Return success response
 *
 * @returns ServerResponse indicating logout success or error
 *
 * @example
 * ```tsx
 * const result = await handleLogoutAction();
 *
 * if (!result.hasError) {
 *   // Logout successful, redirect to home page
 *   redirect('/');
 * }
 * ```
 */
export async function handleLogoutAction() {
  return actionWrapper(async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');

    return formatSuccess(AUTH_SUCCESS_MESSAGES.LOGOUT, null);
  });
}
