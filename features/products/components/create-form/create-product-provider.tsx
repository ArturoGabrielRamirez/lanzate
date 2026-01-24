"use client";

import { createContext, useContext, useState, useCallback } from "react";

import { useStep } from "@/features/global/hooks/use-step";
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
 * Total number of steps in the create product form
 *
 * Steps:
 * 1. Basic Info - name, description, slug, brand, status, SEO
 * 2. Media - product images
 * 3. Options/Variants - attributes and variant combinations
 * 4. Type Specific - physical vs digital product settings
 * 5. Configurations - inventory, pricing, promotions
 */
const TOTAL_STEPS = 5;

/**
 * Initial form values for product creation
 */
const initialFormValues: CreateProductFormState = {
  basicInfo: {
    name: "",
    description: "",
    slug: "",
    brand: "",
    status: "DRAFT",
    seoTitle: "",
    seoDescription: "",
    urlSlug: "",
    ogImageUrl: "",
  },
  media: {
    images: [],
  },
  variants: {
    hasVariants: false,
    options: [],
    variants: [],
  },
  configurations: {
    isDigital: false,
    trackInventory: true,
    isFeatured: false,
    isNew: true,
    isOnSale: false,
    allowPromotions: true,
    digital: null,
    physical: {
      weight: null,
      weightUnit: "kg",
      width: null,
      height: null,
      depth: null,
      dimensionUnit: "cm",
    },
  },
};

/**
 * Context for the create product form
 */
const CreateProductContext = createContext<CreateProductContextType | null>(null);

/**
 * Hook to access the create product form context
 *
 * @throws Error if used outside of CreateProductProvider
 * @returns The create product context value
 *
 * @example
 * const { values, setBasicInfo, goToNextStep } = useCreateProductContext();
 */
function useCreateProductContext(): CreateProductContextType {
  const ctx = useContext(CreateProductContext);
  if (!ctx) {
    throw new Error("useCreateProductContext must be used within CreateProductProvider");
  }
  return ctx;
}

/**
 * Deep merge helper for nested objects
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
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
function CreateProductProvider({
  children,
  initialValues: propInitialValues,
}: CreateProductProviderProps) {
  // Merge initial values with prop overrides
  const [values, setValuesState] = useState<CreateProductFormState>(() =>
    deepMerge(initialFormValues, propInitialValues || {})
  );

  // Step validation tracking
  const [isStepValid, setIsStepValid] = useState<CreateProductStepValidation>({});

  // Step navigation using the useStep hook
  const [
    step,
    { setStep, goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, reset: resetStep },
  ] = useStep(TOTAL_STEPS);

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
    setValuesState(deepMerge(initialFormValues, propInitialValues || {}));
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

export { CreateProductProvider, useCreateProductContext };
