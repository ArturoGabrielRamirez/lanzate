/**
 * Type definitions for global form components
 *
 * These types define the prop interfaces for reusable form components
 * used throughout the application.
 */

import { FieldValues, Resolver, DefaultValues } from "react-hook-form";

import { ServerResponse } from "@/features/global/types";

/**
 * Props for the InputField component
 *
 * Defines all possible configuration options for the global InputField component
 * including icons, tooltips, validation, and accessibility features.
 * Supports both input and textarea variants through the 'as' prop.
 */
export type InputFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  startIcon?: React.ReactNode;
  startText?: string;
  endIcon?: React.ReactNode;
  endText?: string | React.ReactNode;
  description?: string | React.ReactNode;
  type?: string;
  tooltip?: string | React.ReactNode;
  defaultValue?: string;
  isRequired?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  inputMode?:
    | "text"
    | "email"
    | "search"
    | "tel"
    | "url"
    | "none"
    | "decimal"
    | "numeric"
    | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hideLabel?: boolean;
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  /** Render as textarea instead of input */
  as?: "input" | "textarea";
  /** Minimum height for textarea (only applies when as="textarea") */
  minHeight?: string;
  /** Number of rows for textarea (only applies when as="textarea") */
  rows?: number;
};

/**
 * Props for the Form component
 *
 * Defines configuration options for the global Form wrapper component
 * including submission handling, validation, loading states, and success/error callbacks.
 *
 * @template T - The type of the form data (extends FieldValues from react-hook-form)
 */
export type FormProps<T extends FieldValues> = {
  children: React.ReactNode;
  resolver?: Resolver<T>;
  contentButton?: string;
  formAction?: (data: T) => Promise<ServerResponse<unknown>>;
  successRedirect?: string;
  successMessage?: string;
  loadingMessage?: string;
  className?: string;
  onComplete?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  disabled?: boolean;
  submitButton?: boolean;
  resetOnSuccess?: boolean;
  submitButtonClassName?: string;
  onSubmitStart?: () => void | Promise<void>;
  onSubmitEnd?: () => void | Promise<void>;
  defaultValues?: DefaultValues<T>;
};

/**
 * Props for the LoadingSubmitButton component
 *
 * Defines configuration options for the loading submit button used within forms.
 */
export type LoadingSubmitButtonProps = {
  text?: string;
  disabled?: boolean;
  className?: string;
};
