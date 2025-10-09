'use server';

import { getCurrentUserData } from '@/features/global/data';
import { CurrentUserInfo } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils';

export const getCurrentUserAction = async () => {

  return actionWrapper<CurrentUserInfo | null>(async () => {

    const { payload, message } = await getCurrentUserData();

    return {
      message,
      payload,
      hasError: false
    };

  });

};


