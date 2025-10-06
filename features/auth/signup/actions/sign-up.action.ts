'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { signUpWithPasswordData } from '../data';
import type { ServerResponse } from '@/features/global/types';
import type { SignUpActionParams } from '../types';

export const signUpAction = async ({ email, password }: SignUpActionParams): Promise<ServerResponse<{ userId: string }>> => {
  return actionWrapper<{ userId: string }>(async () => {
    const { data, error } = await signUpWithPasswordData({ email, password });

    if (error || !data?.user) {
      return {
        hasError: true,
        error: error?.message || 'Signup failed',
        message: error?.message || 'Signup failed',
        payload: null,
      } as ServerResponse<{ userId: string }>;
    }

    return {
      hasError: false,
      error: null,
      message: 'Account created successfully. Please check your email to verify your account.',
      payload: { userId: data.user.id },
    } as ServerResponse<{ userId: string }>;
  });
};

