import type { Dispatch, SetStateAction } from 'react';

/**
 * Actions available for step navigation
 */
export type UseStepActions = {
  goToNextStep: () => void;
  goToPrevStep: () => void;
  reset: () => void;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  setStep: Dispatch<SetStateAction<number>>;
};

export type SetStepCallbackType = (step: number | ((step: number) => number)) => void;
