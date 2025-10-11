'use server';

import { headers } from 'next/headers';

import { extractSubdomainFromHost } from '@/features/auth/forgot-password/utils';
import { APP_CONFIG } from '@/features/global/constants';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { createServerSideClient } from '@/lib/supabase/server';

export const googleSignInAction = async () => {
  return actionWrapper<{ url: string }>(async () => {
    const supabase = await createServerSideClient();
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const subdomain = extractSubdomainFromHost(host);

    const rootBase = `${APP_CONFIG.PROTOCOL}://${APP_CONFIG.ROOT_DOMAIN}`;
    const redirectUrl = `${rootBase}/auth/callback${subdomain ? `?subdomain=${subdomain}` : ''}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        scopes: 'email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          include_granted_scopes: 'true',
        },
      },
    });

    if (error) {
      return {
        hasError: true,
        message: error.message || 'OAuth error',
        payload: null,
      };
    }

    if (!data?.url) {
      return {
        hasError: true,
        message: 'No URL returned from OAuth provider',
        payload: null,
      };
    }

    return {
      hasError: false,
      message: 'Google login initiated successfully',
      payload: { url: data.url },
    };
  });
};


