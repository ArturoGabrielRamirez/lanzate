'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { resetPasswordRequestData } from '../data/reset-password.data';
import { headers } from 'next/headers';
import { extractSubdomainFromHost } from '../utils/extract-subdomain-from-host';
import { APP_CONFIG } from '@/features/global/constants';

export const resetPasswordAction = async (email: string) => {
  return actionWrapper(async () => {
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const subdomain = extractSubdomainFromHost(host);

    const baseUrl = subdomain
      ? `${APP_CONFIG.PROTOCOL}://${subdomain}.${APP_CONFIG.ROOT_DOMAIN}`
      : `${APP_CONFIG.PROTOCOL}://${APP_CONFIG.ROOT_DOMAIN}`;

    const redirectTo = `${baseUrl}/update-password`;

    const { error } = await resetPasswordRequestData(email, redirectTo);

    if (error) {
      return {
        hasError: true,
        message: error.message || 'Failed to send reset email',
        payload: null,
      } as const;
    }

    return {
      hasError: false,
      message: 'Reset email sent',
      payload: null,
    } as const;
  });
};


