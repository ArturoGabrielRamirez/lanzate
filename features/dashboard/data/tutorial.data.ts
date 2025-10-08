'use server';

import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils';

export const checkTutorialStatusAction = async (): Promise<ServerResponse<{ shouldShowTutorial: boolean }>> => {
  return actionWrapper<{ shouldShowTutorial: boolean }>(async () => {
    return {
      message: 'Tutorial status checked',
      payload: { shouldShowTutorial: true },
      hasError: false,
    };
  });
};
