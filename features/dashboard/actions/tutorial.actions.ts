'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import type { ServerResponse } from '@/features/global/types';

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

/**
 * Server action placeholder for tutorial step update
 * The actual localStorage logic is handled client-side
 */
export const updateTutorialStepAction = async (step: number): Promise<ServerResponse<null>> => {
  return actionWrapper<null>(async () => {
    // This is handled client-side with localStorage
    return {
      message: 'Tutorial step update will be handled client-side',
      payload: null,
      hasError: false,
    };
  });
};

/**
 * Server action placeholder for tutorial completion check
 * The actual localStorage logic is handled client-side
 */
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

/**
 * Server action placeholder for tutorial state
 * The actual localStorage logic is handled client-side
 */
export const getTutorialStateAction = async (): Promise<ServerResponse<any>> => {
  return actionWrapper<any>(async () => {
    // This is handled client-side with localStorage
    return {
      message: 'Tutorial state will be retrieved client-side',
      payload: null,
      hasError: false,
    };
  });
};
