import { NextResponse } from 'next/server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { createUserService } from '@/features/auth/services';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth Callback Route Handler
 *
 * Handles OAuth callback from Supabase after user completes authentication
 * with Google OAuth provider.
 *
 * Flow:
 * 1. Extract authorization code from URL params
 * 2. Exchange code for session with Supabase
 * 3. Get authenticated user
 * 4. Check if user exists in database
 * 5. Create database user if first login (auto-generate username)
 * 6. Redirect to /dashboard on success
 * 7. Redirect to /login with error on failure
 *
 * @param request - The incoming request with OAuth callback params
 * @returns NextResponse with redirect to dashboard or login
 *
 * @example
 * Google OAuth redirects to: /auth/callback?code=xxx
 * This handler processes the code and redirects to /dashboard
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  // Extract locale from URL path (e.g., /es/auth/callback)
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const locale = pathSegments[0] || 'es'; // Default to 'es' if not found

  // Handle OAuth errors (e.g., user cancelled)
  if (error) {
    console.error('OAuth error:', error, errorDescription);

    // Detect if user cancelled the OAuth flow
    const cancellationErrors = ['access_denied', 'user_cancelled_authorize'];
    const isCancellation = cancellationErrors.includes(error.toLowerCase());

    if (isCancellation) {
      // Redirect to login with info message
      const loginUrl = new URL(`/${locale}/login`, url.origin);
      loginUrl.searchParams.set('info', 'oauth_cancelled');
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to login with error
    const loginUrl = new URL(`/${locale}/login`, url.origin);
    loginUrl.searchParams.set('error', 'oauth_error');
    loginUrl.searchParams.set('message', errorDescription || 'OAuth authentication failed');
    return NextResponse.redirect(loginUrl);
  }

  // Validate authorization code exists
  if (!code) {
    console.error('No authorization code provided in OAuth callback');
    const loginUrl = new URL(`/${locale}/login`, url.origin);
    loginUrl.searchParams.set('error', 'missing_code');
    loginUrl.searchParams.set('message', 'Authorization code not provided');
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Create Supabase client
    const supabase = await createClient();

    // Exchange authorization code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      const loginUrl = new URL(`/${locale}/login`, url.origin);
      loginUrl.searchParams.set('error', 'exchange_failed');
      loginUrl.searchParams.set('message', 'Failed to complete authentication');
      return NextResponse.redirect(loginUrl);
    }

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user after OAuth:', userError);
      const loginUrl = new URL(`/${locale}/login`, url.origin);
      loginUrl.searchParams.set('error', 'user_fetch_failed');
      loginUrl.searchParams.set('message', 'Failed to retrieve user information');
      return NextResponse.redirect(loginUrl);
    }

    // Check if user exists in database
    let dbUser = null;
    try {
      dbUser = await getUserBySupabaseId(user.id);
    } catch (error) {
      // User doesn't exist in database - this is expected for first login
      dbUser = null;
    }

    // Create database user if first login
    if (!dbUser && user.email) {
      try {
        await createUserService({
          email: user.email,
          supabaseId: user.id,
        });
        console.log('Created new database user for OAuth login:', user.email);
      } catch (createError) {
        console.error('Error creating database user:', createError);

        // Check if error is due to duplicate email
        const isDuplicateEmail = createError instanceof Error &&
          createError.message.includes('already exists');

        const loginUrl = new URL(`/${locale}/login`, url.origin);
        loginUrl.searchParams.set('error', 'user_creation_failed');
        loginUrl.searchParams.set(
          'message',
          isDuplicateEmail
            ? 'An account with this email already exists'
            : 'Failed to create user account'
        );
        return NextResponse.redirect(loginUrl);
      }
    }

    // Success - redirect to dashboard
    const dashboardUrl = new URL(`/${locale}/dashboard`, url.origin);
    return NextResponse.redirect(dashboardUrl);

  } catch (unexpectedError) {
    console.error('Unexpected error in OAuth callback:', unexpectedError);
    const loginUrl = new URL(`/${locale}/login`, url.origin);
    loginUrl.searchParams.set('error', 'unexpected_error');
    loginUrl.searchParams.set('message', 'An unexpected error occurred during authentication');
    return NextResponse.redirect(loginUrl);
  }
}
