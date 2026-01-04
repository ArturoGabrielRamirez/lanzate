/**
 * Authentication Component Prop Types
 *
 * This file contains type definitions for all authentication-related
 * component props. These types define the interface for components
 * used in the authentication feature.
 *
 * Separating component prop types into a dedicated file improves
 * organization and makes it easier to locate and maintain component
 * interfaces.
 */

import type { ReactNode } from "react";

/**
 * SignupFormProps
 *
 * Props for the SignupForm component.
 * Currently, the component doesn't accept props as it handles
 * all configuration internally.
 */
export type SignupFormProps = Record<string, never>;

/**
 * LoginFormProps
 *
 * Props for the LoginForm component.
 * Currently, the component doesn't accept props as it handles
 * all configuration internally.
 */
export type LoginFormProps = Record<string, never>;

/**
 * GoogleAuthButtonProps
 *
 * Props for the GoogleAuthButton component.
 * Currently, the component doesn't accept props as it handles
 * all configuration internally.
 */
export type GoogleAuthButtonProps = Record<string, never>;

/**
 * PasswordResetRequestFormProps
 *
 * Props for the PasswordResetRequestForm component.
 * Currently, the component doesn't accept props as it handles
 * all configuration internally.
 */
export type PasswordResetRequestFormProps = Record<string, never>;

/**
 * PasswordResetFormProps
 *
 * Props for the PasswordResetForm component.
 * Currently, the component doesn't accept props as it handles
 * all configuration internally.
 */
export type PasswordResetFormProps = Record<string, never>;

/**
 * ProfileEditFormProps
 *
 * Props for the ProfileEditForm component.
 * Currently, the component doesn't accept props as it fetches
 * user data internally using getCurrentUserAction.
 */
export type ProfileEditFormProps = Record<string, never>;

/**
 * AuthCardProps
 *
 * Props for the AuthCard wrapper component.
 *
 * @property children - The content to render inside the card (typically a form)
 * @property heading - Optional heading/title text displayed in the card header
 * @property description - Optional description/subtitle text displayed in the card header
 * @property footer - Optional footer content (typically links or additional actions)
 * @property className - Optional CSS classes for custom styling
 */
export type AuthCardProps = {
  /** The content to render inside the card (typically a form component) */
  children: ReactNode;
  /** Optional heading/title text displayed in the card header */
  heading?: string;
  /** Optional description/subtitle text displayed in the card header */
  description?: string;
  /** Optional footer content (typically links or additional actions) */
  footer?: ReactNode;
  /** Optional CSS classes for custom styling */
  className?: string;
};
