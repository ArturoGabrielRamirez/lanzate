'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { signInWithPasswordData } from '../data/sign-in.data';
import { revalidatePath } from 'next/cache';

export interface SignInActionParams {
  email: string;
  password: string;
}

export const signInAction = async ({ email, password }: SignInActionParams) => {
  return actionWrapper(async () => {
    const { data, error } = await signInWithPasswordData({ email, password });

    if (error || !data?.user) {
      return {
        hasError: true,
        error: 'Invalid credentials',
        message: 'Invalid credentials',
        payload: null,
      } as const;
    }

    revalidatePath('/');

    return {
      hasError: false,
      error: null,
      message: 'Logged in successfully',
      payload: { userId: data.user.id },
    } as const;
  });
};


