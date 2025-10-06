'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { getCurrentUserData, type CurrentUserInfo } from '@/features/global/data/get-current-user.data';

export const getCurrentUserAction = async () => {
  return actionWrapper<CurrentUserInfo | null>(async () => {
    const { payload } = await getCurrentUserData();
    return { message: 'OK', payload, hasError: false };
  });
};


