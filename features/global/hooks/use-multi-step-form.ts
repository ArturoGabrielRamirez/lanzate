"use client";

import { useCallback, useMemo } from "react";

import type {
  MultiStepFormContext,
  UseMultiStepFormOptions,
} from "@/features/global/types";

/**
 * Enhanced hook for consuming multi-step form context with additional utilities
 *
 * Provides extra functionality on top of the base context:
 * - Validation-aware navigation
 * - Form completion tracking
 * - Progress percentage
 * - Step-specific setter factory
 *
 * @param context - The multi-step form context from the provider
 * @param options - Optional configuration for validation
 *
 * @example
 * const ctx = useCreateProductContext();
 * const form = useMultiStepForm(ctx, {
 *   validateStep: async (step, values) => {
 *     // Custom validation logic
 *     return true;
 *   }
 * });
 *
 * // Use enhanced utilities
 * await form.nextStepWithValidation();
 * console.log(form.completionPercentage); // 40
 * console.log(form.isFormComplete); // false
 */
export function useMultiStepForm<TValues extends Record<string, unknown>>(
  context: MultiStepFormContext<TValues>,
  options: UseMultiStepFormOptions<TValues> = {}
) {
  const { validateStep, onValidationError } = options;

  /**
   * Advance to next step with validation
   * Returns true if navigation was successful, false otherwise
   */
  const nextStepWithValidation = useCallback(async () => {
    if (validateStep) {
      const isValid = await validateStep(context.step, context.values);
      if (!isValid) {
        context.setStepValid(context.step, false);
        onValidationError?.(context.step);
        return false;
      }
      context.setStepValid(context.step, true);
    }
    context.goToNextStep();
    return true;
  }, [context, validateStep, onValidationError]);

  /**
   * Check if all steps up to current are valid
   */
  const isFormProgressValid = useMemo(() => {
    for (let i = 1; i < context.step; i++) {
      if (context.isStepValid[i] === false) return false;
    }
    return true;
  }, [context.step, context.isStepValid]);

  /**
   * Check if entire form is valid (all steps marked as valid)
   */
  const isFormComplete = useMemo(() => {
    for (let i = 1; i <= context.totalSteps; i++) {
      if (context.isStepValid[i] !== true) return false;
    }
    return true;
  }, [context.totalSteps, context.isStepValid]);

  /**
   * Get completion percentage based on validated steps
   */
  const completionPercentage = useMemo(() => {
    const validSteps = Object.values(context.isStepValid).filter(Boolean).length;
    return Math.round((validSteps / context.totalSteps) * 100);
  }, [context.isStepValid, context.totalSteps]);

  /**
   * Create a step-specific setter for a key in values
   * Useful for creating setters like setBasicInfo, setMedia, etc.
   *
   * @example
   * const setBasicInfo = createStepSetter('basicInfo');
   * setBasicInfo({ name: 'New Name' }); // Only updates basicInfo.name
   */
  const createStepSetter = useCallback(
    <K extends keyof TValues>(key: K) =>
      (data: Partial<TValues[K]>) => {
        context.setValues({
          [key]: { ...context.values[key], ...data },
        } as Partial<TValues>);
      },
    [context]
  );

  /**
   * Get a specific section of values
   */
  const getStepValues = useCallback(
    <K extends keyof TValues>(key: K): TValues[K] => {
      return context.values[key];
    },
    [context.values]
  );

  /**
   * Validate current step and mark it
   */
  const validateCurrentStep = useCallback(
    async (isValid: boolean) => {
      context.setStepValid(context.step, isValid);
      return isValid;
    },
    [context]
  );

  return {
    // Spread all base context properties
    ...context,
    // Enhanced utilities
    nextStepWithValidation,
    isFormProgressValid,
    isFormComplete,
    completionPercentage,
    createStepSetter,
    getStepValues,
    validateCurrentStep,
  };
}
