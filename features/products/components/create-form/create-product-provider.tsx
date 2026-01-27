"use client";

import { createContext, useState, useCallback } from "react";

import { useStep } from "@/features/global/hooks/use-step";
import { deepMerge } from "@/features/global/utils";
import {
  CREATE_PRODUCT_TOTAL_STEPS,
  CREATE_PRODUCT_INITIAL_VALUES,
} from "@/features/products/constants";
import type {
  CreateProductFormState,
  CreateProductContextType,
  CreateProductProviderProps,
  CreateProductBasicInfo,
  CreateProductMedia,
  CreateProductVariants,
  CreateProductConfigurations,
  CreateProductStepValidation,
} from "@/features/products/types";

/**
 * Context for the create product form
 */
export const CreateProductContext = createContext<CreateProductContextType | null>(null);

/**
 * Provider component for the create product multi-step form
 *
 * Manages form state across all steps including:
 * - basicInfo: Product name, description, slug, brand, status, SEO fields
 * - media: Product images with ordering and primary selection
 * - variants: Product options/attributes and variant combinations
 * - configurations: Digital/physical settings, inventory, flags
 *
 * @example
 * <CreateProductProvider>
 *   <CreateProductForm />
 * </CreateProductProvider>
 */
export function CreateProductProvider({
  children,
  initialValues: propInitialValues,
}: CreateProductProviderProps) {
  // Merge initial values with prop overrides
  const [values, setValuesState] = useState<CreateProductFormState>(() =>
    deepMerge<CreateProductFormState>(CREATE_PRODUCT_INITIAL_VALUES, propInitialValues || {})
  );

  // Step validation tracking
  const [isStepValid, setIsStepValid] = useState<CreateProductStepValidation>({});

  // Step navigation using the useStep hook
  const [
    step,
    { setStep, goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, reset: resetStep },
  ] = useStep(CREATE_PRODUCT_TOTAL_STEPS);

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Update form values with partial state
   */
  const setValues = useCallback((partial: Partial<CreateProductFormState>) => {
    setValuesState(prev => deepMerge(prev, partial));
  }, []);

  /**
   * Update basic info step values
   */
  const setBasicInfo = useCallback((data: Partial<CreateProductBasicInfo>) => {
    setValuesState(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data },
    }));
  }, []);

  /**
   * Update media step values
   */
  const setMedia = useCallback((data: Partial<CreateProductMedia>) => {
    setValuesState(prev => ({
      ...prev,
      media: { ...prev.media, ...data },
    }));
  }, []);

  /**
   * Update variants step values
   */
  const setVariants = useCallback((data: Partial<CreateProductVariants>) => {
    setValuesState(prev => ({
      ...prev,
      variants: { ...prev.variants, ...data },
    }));
  }, []);

  /**
   * Update configurations step values
   */
  const setConfigurations = useCallback((data: Partial<CreateProductConfigurations>) => {
    setValuesState(prev => ({
      ...prev,
      configurations: { ...prev.configurations, ...data },
    }));
  }, []);

  /**
   * Set validation state for a specific step
   */
  const setStepValid = useCallback((stepNumber: number, valid: boolean) => {
    setIsStepValid(prev => ({ ...prev, [stepNumber]: valid }));
  }, []);

  /**
   * Open the create product dialog
   */
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close the create product dialog
   */
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValuesState(deepMerge<CreateProductFormState>(CREATE_PRODUCT_INITIAL_VALUES, propInitialValues || {}));
    setIsStepValid({});
    resetStep();
    setIsSubmitting(false);
  }, [propInitialValues, resetStep]);

  const contextValue: CreateProductContextType = {
    values,
    setValues,
    setBasicInfo,
    setMedia,
    setVariants,
    setConfigurations,
    isStepValid,
    setStepValid,
    step,
    setStep,
    goToNextStep,
    goToPrevStep,
    canGoToNextStep,
    canGoToPrevStep,
    isOpen,
    openDialog,
    closeDialog,
    resetForm,
    isSubmitting,
    setIsSubmitting,
  };

  return (
    <CreateProductContext.Provider value={contextValue}>
      {children}
    </CreateProductContext.Provider>
  );
}
