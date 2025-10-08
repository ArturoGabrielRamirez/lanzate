'use server';

import type { TutorialState } from '@/features/dashboard/types';
import type { ServerResponse } from '@/features/global/types';
import { actionWrapper } from '@/features/global/utils';

/**
 * Server action placeholder for tutorial completion
 * The actual localStorage logic is handled client-side
 */
export const markTutorialCompletedAction = async (): Promise<ServerResponse<null>> => {
  return actionWrapper<null>(async () => {
    // This is handled client-side with localStorage
    return {
      message: 'Tutorial completion will be handled client-side',
      payload: null,
      hasError: false,
    };
  });
};



export const updateTutorialStepAction = async (): Promise<ServerResponse<null>> => {
  return actionWrapper<null>(async () => {
    return {
      message: 'Tutorial step update will be handled client-side',
      payload: null,
      hasError: false,
    };
  });
};


export const isTutorialCompletedAction = async (): Promise<ServerResponse<boolean>> => {
  return actionWrapper<boolean>(async () => {
    // This is handled client-side with localStorage
    return {
      message: 'Tutorial status will be checked client-side',
      payload: false, // Default to false, will be overridden client-side
      hasError: false,
    };
  });
};


export const getTutorialStateAction = async (): Promise<ServerResponse<TutorialState>> => {
  return actionWrapper<TutorialState>(async () => {
    return {
      message: 'Tutorial state will be retrieved client-side',
      payload: null,
      hasError: false,
    } as unknown as ServerResponse<TutorialState>;
  });
};
