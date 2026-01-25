import type { ReactNode, Dispatch, SetStateAction } from "react";

/**
 * Base context value that all multi-step form contexts share
 */
export interface BaseMultiStepFormContext<TValues> {
  /** Current form values */
  values: TValues;
  /** Update form values (partial merge) */
  setValues: (partial: Partial<TValues>) => void;
  /** Step validation state per step number */
  isStepValid: Record<number, boolean>;
  /** Set validation state for a specific step */
  setStepValid: (step: number, valid: boolean) => void;
  /** Check if a specific step is valid */
  checkStepValid: (step: number) => boolean;
  /** Current step number (1-indexed) */
  step: number;
  /** Set current step directly */
  setStep: Dispatch<SetStateAction<number>>;
  /** Navigate to next step */
  goToNextStep: () => void;
  /** Navigate to previous step */
  goToPrevStep: () => void;
  /** Whether can navigate to next step */
  canGoToNextStep: boolean;
  /** Whether can navigate to previous step */
  canGoToPrevStep: boolean;
  /** Total number of steps */
  totalSteps: number;
  /** Reset to initial values and step */
  reset: () => void;
}

/**
 * Dialog state extension for forms shown in dialogs
 */
export interface DialogState {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Open the dialog */
  openDialog: () => void;
  /** Close the dialog */
  closeDialog: () => void;
}

/**
 * Submission state extension
 */
export interface SubmissionState {
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Set submitting state */
  setIsSubmitting: (value: boolean) => void;
}

/**
 * Complete multi-step form context with dialog and submission state
 */
export interface MultiStepFormContext<TValues>
  extends BaseMultiStepFormContext<TValues>,
    DialogState,
    SubmissionState {}

/**
 * Configuration for creating a multi-step form provider
 */
export interface CreateMultiStepFormProviderConfig<TValues> {
  /** Initial form values */
  initialValues: TValues;
  /** Total number of steps */
  totalSteps: number;
  /** Context display name for React DevTools */
  displayName: string;
}

/**
 * Props for the generated provider component
 */
export interface MultiStepFormProviderProps<TValues> {
  children: ReactNode;
  /** Override initial values */
  initialValues?: Partial<TValues>;
}

/**
 * Return type of the createMultiStepFormProvider factory
 */
export interface MultiStepFormProviderResult<TValues> {
  /** The Provider component to wrap your form */
  Provider: React.FC<MultiStepFormProviderProps<TValues>>;
  /** Hook to consume the context */
  useContext: () => MultiStepFormContext<TValues>;
  /** Context object for advanced use cases */
  Context: React.Context<MultiStepFormContext<TValues> | null>;
}

/**
 * Step setter function type for dynamic step updates
 */
export type StepSetter<T> = (data: Partial<T>) => void;

/**
 * Options for useMultiStepForm hook
 */
export interface UseMultiStepFormOptions<TValues> {
  /** Validation function called before advancing to next step */
  validateStep?: (step: number, values: TValues) => boolean | Promise<boolean>;
  /** Callback when validation fails */
  onValidationError?: (step: number) => void;
}
