"use client";

import { useCallback, useState } from 'react';

import type { SetStepCallbackType, UseStepActions } from '@/features/global/types';

/**
 * Custom hook for managing multi-step form navigation
 *
 * @param maxStep - The maximum number of steps in the form
 * @returns A tuple containing the current step number and navigation actions
 *
 * @example
 * const [step, { goToNextStep, goToPrevStep, setStep }] = useStep(5);
 */
export function useStep(maxStep: number): [number, UseStepActions] {
  const [currentStep, setCurrentStep] = useState(1);

  const canGoToNextStep = currentStep + 1 <= maxStep;
  const canGoToPrevStep = currentStep - 1 > 0;

  const setStep = useCallback<SetStepCallbackType>(
    step => {
      const newStep = step instanceof Function ? step(currentStep) : step;

      if (newStep >= 1 && newStep <= maxStep) {
        setCurrentStep(newStep);
        return;
      }

      throw new Error('Step not valid');
    },
    [maxStep, currentStep],
  );

  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) {
      setCurrentStep(step => step + 1);
    }
  }, [canGoToNextStep]);

  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) {
      setCurrentStep(step => step - 1);
    }
  }, [canGoToPrevStep]);

  const reset = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return [
    currentStep,
    {
      goToNextStep,
      goToPrevStep,
      canGoToNextStep,
      canGoToPrevStep,
      setStep,
      reset,
    },
  ];
}
