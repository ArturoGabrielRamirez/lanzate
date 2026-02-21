'use server';

import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '@/features/auth/constants';
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
 * 3. Validate that a redirect URL was returned
 * 4. Return redirect URL for OAuth
 *
 * @param locale - The user's locale preference ('es' or 'en')
 * @returns ServerResponse with OAuth redirect URL
 *
 * @example
 * ```tsx
 * const result = await handleGoogleLoginAction('en');
 *
 * if (!result.hasError && result.payload?.url) {
 *   // Redirect user to Google OAuth page
 *   window.location.href = result.payload.url;
 * }
 * ```
 */
export async function handleGoogleLoginAction(locale: string = 'es') {
  return actionWrapper(async () => {
    const supabase = await createClient();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/auth/callback?locale=${locale}`;

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
      throw new Error(AUTH_ERROR_MESSAGES.NO_REDIRECT_URL);
    }

    return formatSuccess(AUTH_SUCCESS_MESSAGES.OAUTH_INITIATED, {
      url: data.url,
    });
  });
}
