'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { createClient } from '@/lib/supabase/server';

/**
 * Google OAuth Login Server Action
 *
 * Initiates the Google OAuth authentication flow with Supabase.
 * Returns a redirect URL that the client should navigate to for OAuth.
 *
 * Flow:
 * 1. Create Supabase client
 * 2. Initiate OAuth flow with Google provider
 * 3. Return redirect URL for OAuth
 * 4. User completes OAuth on Google's site
 * 5. Google redirects to /auth/callback
 *
 * @returns ServerResponse with OAuth redirect URL
 *
 * @example
 * ```tsx
 * import { handleGoogleLoginAction } from '@/features/auth/actions/handleGoogleLogin.action';
 *
 * const result = await handleGoogleLoginAction();
 *
 * if (!result.hasError && result.payload?.url) {
 *   // Redirect user to Google OAuth page
 *   window.location.href = result.payload.url;
 * }
 * ```
 */
export async function handleGoogleLoginAction() {
  return actionWrapper(async () => {
    // Create Supabase client
    const supabase = await createClient();

    // Get the base URL for the redirect
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/auth/callback`;

    // Initiate OAuth flow with Google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.url) {
      throw new Error('No redirect URL returned from OAuth provider');
    }

    // Return success response with redirect URL
    return formatSuccess('Google OAuth initiated successfully', {
      url: data.url,
    });
  });
}
