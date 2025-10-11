'use server';

import { createUserData, signUpWithPasswordData } from '@/features/auth/signup/data';
import type { SignUpActionParams } from '@/features/auth/signup/types';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';

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

    const { error: userError } = await createUserData({
      email,
      supabaseUserId: data.user.id,
      avatar: data.user.user_metadata.avatar,
      firstName: data.user.user_metadata.first_name,
      lastName: data.user.user_metadata.last_name,
      phone: data.user.user_metadata.phone,

    });

    if (userError) {
      return {
        hasError: true,
        error: userError.message,
        message: userError.message,
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

