'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import type { ServerResponse } from '@/features/global/types';

/**
 * Server action to check if tutorial should be shown
 * This is a placeholder - the actual localStorage logic is in utils
 */
export const checkTutorialStatusAction = async (): Promise<ServerResponse<{ shouldShowTutorial: boolean }>> => {
  return actionWrapper<{ shouldShowTutorial: boolean }>(async () => {
    // This will be handled client-side
    return {
      message: 'Tutorial status checked',
      payload: { shouldShowTutorial: true },
      hasError: false,
    };
  });
};
