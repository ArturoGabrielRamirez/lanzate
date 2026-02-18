"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useStep } from "@/features/global/hooks/use-step";
import type {
  MultiStepFormContext,
  CreateMultiStepFormProviderConfig,
  MultiStepFormProviderProps,
  MultiStepFormProviderResult,
} from "@/features/global/types";

/**
 * Deep merge helper for nested objects
 * Preserves arrays and handles null values correctly
 */
function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue !== null &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Factory function to create a multi-step form provider with typed context
 *
 * This factory creates a complete provider system for multi-step forms including:
 * - Form values state management with deep merge support
 * - Step navigation using the useStep hook
 * - Step validation tracking
 * - Dialog state (open/close)
 * - Submission state
 * - Reset functionality
 *
 * @param config - Configuration for the provider
 * @returns Provider component, useContext hook, and Context object
 *
 * @example
 * // Create a provider for product creation form
 * const { Provider, useContext } = createMultiStepFormProvider({
 *   initialValues: {
 *     basicInfo: { name: '', description: '' },
 *     media: { images: [] },
 *   },
 *   totalSteps: 5,
 *   displayName: 'CreateProduct',
 * });
 *
 * // Use in your app
 * export { Provider as CreateProductProvider, useContext as useCreateProductContext };
 *
 * // Then in your form
 * function MyForm() {
 *   const { values, setValues, step, goToNextStep } = useCreateProductContext();
 *   return <div>...</div>;
 * }
 */
export function createMultiStepFormProvider<
  TValues extends Record<string, unknown>
>(
  config: CreateMultiStepFormProviderConfig<TValues>
): MultiStepFormProviderResult<TValues> {
  const { initialValues, totalSteps, displayName } = config;

  // Create the context with null as default
  const FormContext = createContext<MultiStepFormContext<TValues> | null>(null);
  FormContext.displayName = `${displayName}Context`;

  /**
   * Hook for consuming the context
   * Throws an error if used outside the provider
   */
  function useFormContext(): MultiStepFormContext<TValues> {
    const ctx = useContext(FormContext);
    if (!ctx) {
      throw new Error(
        `use${displayName}Context must be used within ${displayName}Provider`
      );
    }
    return ctx;
  }

  /**
   * Provider component that wraps the form
   */
  function FormProvider({
    children,
    initialValues: propInitialValues,
  }: MultiStepFormProviderProps<TValues>) {
    // Merge initial values with prop overrides
    const [values, setValuesState] = useState<TValues>(() =>
      deepMerge(initialValues, propInitialValues || {})
    );

    // Step validation tracking
    const [isStepValid, setIsStepValid] = useState<Record<number, boolean>>({});

    // Step navigation using the useStep hook
    const [
      step,
      { setStep, goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, reset: resetStep },
    ] = useStep(totalSteps);

    // Dialog state
    const [isOpen, setIsOpen] = useState(false);

    // Submitting state
    const [isSubmitting, setIsSubmittingState] = useState(false);

    /**
     * Update form values with partial state (deep merge)
     */
    const setValues = useCallback((partial: Partial<TValues>) => {
      setValuesState((prev) => deepMerge(prev, partial));
    }, []);

    /**
     * Set validation state for a specific step
     */
    const setStepValid = useCallback((stepNumber: number, valid: boolean) => {
      setIsStepValid((prev) => ({ ...prev, [stepNumber]: valid }));
    }, []);

    /**
     * Check if a specific step is valid
     */
    const checkStepValid = useCallback(
      (stepNumber: number) => isStepValid[stepNumber] ?? true,
      [isStepValid]
    );

    /**
     * Open the dialog
     */
    const openDialog = useCallback(() => setIsOpen(true), []);

    /**
     * Close the dialog
     */
    const closeDialog = useCallback(() => setIsOpen(false), []);

    /**
     * Set submitting state
     */
    const setIsSubmitting = useCallback((value: boolean) => {
      setIsSubmittingState(value);
    }, []);

    /**
     * Reset everything to initial state
     */
    const reset = useCallback(() => {
      setValuesState(deepMerge(initialValues, propInitialValues || {}));
      setIsStepValid({});
      resetStep();
      setIsSubmittingState(false);
    }, [propInitialValues, resetStep]);

    const contextValue = useMemo<MultiStepFormContext<TValues>>(
      () => ({
        values,
        setValues,
        isStepValid,
        setStepValid,
        checkStepValid,
        step,
        setStep,
        goToNextStep,
        goToPrevStep,
        canGoToNextStep,
        canGoToPrevStep,
        totalSteps,
        reset,
        isOpen,
        openDialog,
        closeDialog,
        isSubmitting,
        setIsSubmitting,
      }),
      [
        values,
        setValues,
        isStepValid,
        setStepValid,
        checkStepValid,
        step,
        setStep,
        goToNextStep,
        goToPrevStep,
        canGoToNextStep,
        canGoToPrevStep,
        totalSteps,
        reset,
        isOpen,
        openDialog,
        closeDialog,
        isSubmitting,
        setIsSubmitting,
      ]
    );

    return (
      <FormContext.Provider value={contextValue}>
        {children}
      </FormContext.Provider>
    );
  }

  FormProvider.displayName = `${displayName}Provider`;

  return {
    Provider: FormProvider,
    useContext: useFormContext,
    Context: FormContext,
  };
}
