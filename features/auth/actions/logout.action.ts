'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess, formatError } from '@/features/global/utils/format-response';

/**
 * Logout Server Action
 *
 * Signs out the current user using Supabase auth and redirects to the landing page.
 *
 * This action:
 * - Uses the Supabase server client to sign out
 * - Clears the user's session cookies
 * - Redirects to the landing page (Spanish locale by default)
 *
 * @returns ServerResponse indicating success or error
 *
 * @example
 * ```tsx
 * import { logoutAction } from '@/features/auth/actions/logout.action';
 *
 * function LogoutButton() {
 *   const handleLogout = async () => {
 *     const result = await logoutAction();
 *     if (result.hasError) {
 *       console.error(result.message);
 *     }
 *   };
 *
 *   return <button onClick={handleLogout}>Logout</button>;
 * }
 * ```
 */
export async function logoutAction() {
  return actionWrapper(async () => {
    const supabase = await createClient();

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      return formatError(`Failed to logout: ${error.message}`);
    }

    // Redirect to landing page after successful logout
    redirect('/es');
  });
}
