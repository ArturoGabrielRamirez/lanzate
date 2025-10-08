'use server';

import { getCurrentUserData, type CurrentUserInfo } from '@/features/global/data';
import { actionWrapper } from '@/features/global/utils';

export const getCurrentUserAction = async () => {
  return actionWrapper<CurrentUserInfo | null>(async () => {
    const { payload } = await getCurrentUserData();
    return { message: 'OK', payload, hasError: false };
  });
};


