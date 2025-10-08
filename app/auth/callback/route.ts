import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { getBaseUrlAndLocale, buildRedirect } from '@/features/global/utils/url';
import { createUserData } from '@/features/auth/signup/data';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const error_description = url.searchParams.get('error_description');
  const next = url.searchParams.get('next') || '/dashboard';
  const { baseUrl, locale } = getBaseUrlAndLocale(request);

  // OAuth cancelled or provider error
  if (error) {
    if (error === 'access_denied') {
      const loginRedirectPath = `/login?info=login_cancelled&message=${encodeURIComponent('Login cancelled')}`;
      return NextResponse.redirect(buildRedirect(baseUrl, locale, loginRedirectPath));
    }
    const errorPath = `/login?error=oauth_error&message=${encodeURIComponent(error_description || error)}`;
    return NextResponse.redirect(buildRedirect(baseUrl, locale, errorPath));
  }

  if (!code) {
    const errorPath = `/login?error=missing_code`;
    return NextResponse.redirect(buildRedirect(baseUrl, locale, errorPath));
  }

  const supabase = await createServerSideClient();

  try {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      const errorPath = `/login?error=exchange_failed&message=${encodeURIComponent(exchangeError.message)}`;
      return NextResponse.redirect(buildRedirect(baseUrl, locale, errorPath));
    }

    // Create user in database if they don't exist
    if (data?.user) {
      const { data: userData, error: userError } = await createUserData({
        email: data.user.email || '',
        supabaseUserId: data.user.id,
        avatar: data.user.user_metadata?.avatar_url,
        username: data.user.user_metadata?.preferred_username || data.user.user_metadata?.name,
        firstName: data.user.user_metadata?.given_name,
        lastName: data.user.user_metadata?.family_name,
      });

      if (userError) {
        console.error('Error creating user in database:', userError);
        // Continue with login even if user creation fails
      }
    }

    // Signed in, redirect to next or dashboard
    const successPath = next.startsWith('/') ? next : '/dashboard';
    return NextResponse.redirect(buildRedirect(baseUrl, locale, successPath));

  } catch (unexpectedError) {
    const errorPath = `/login?error=unexpected_error`;
    return NextResponse.redirect(buildRedirect(baseUrl, locale, errorPath));
  }
}


