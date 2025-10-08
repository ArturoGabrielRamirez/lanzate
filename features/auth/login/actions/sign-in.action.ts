'use server';

import { revalidatePath } from 'next/cache';

import { signInWithPasswordData } from '@/features/auth/login/data';
import type { SignInActionParams } from '@/features/auth/login/types';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils/action-wrapper';

export const signInAction = async ({ email, password }: SignInActionParams): Promise<ServerResponse<{ userId: string }>> => {
  return actionWrapper<{ userId: string }>(async () => {
    const { data, error } = await signInWithPasswordData({ email, password });

    if (error || !data?.user) {
      return {
        hasError: true,
        error: 'Invalid credentials',
        message: 'Invalid credentials',
        payload: null,
      } as ServerResponse<{ userId: string }>;
    }

    revalidatePath('/');

    return {
      hasError: false,
      error: null,
      message: 'Logged in successfully',
      payload: { userId: data.user.id },
    } as ServerResponse<{ userId: string }>;
  });
};


