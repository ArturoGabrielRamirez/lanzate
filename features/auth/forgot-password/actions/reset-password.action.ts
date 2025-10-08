'use server';

import { headers } from 'next/headers';

import { resetPasswordRequestData } from '@/features/auth/forgot-password/data';
import { extractSubdomainFromHost } from '@/features/auth/forgot-password/utils';
import { APP_CONFIG } from '@/features/global/constants';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';


export const resetPasswordAction = async (email: string): Promise<ServerResponse<null>> => {
  return actionWrapper<null>(async () => {
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
      } as ServerResponse<null>;
    }

    return {
      hasError: false,
      message: 'Reset email sent',
      payload: null,
    } as ServerResponse<null>;
  });
};


