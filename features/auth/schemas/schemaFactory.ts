/**
 * Authentication Schema Factory Functions
 *
 * This file contains factory functions that create Yup validation schemas
 * with internationalized error messages. Each factory accepts a translation
 * function and returns a fully configured schema with translated validation errors.
 *
 * This approach enables dynamic validation messages based on the user's locale
 * while maintaining type safety and reusability.
 *
 * Usage in Client Components:
 * ```tsx
 * import { useTranslations } from 'next-intl';
 * import { createSignupSchema } from '@/features/auth/schemas/schemaFactory';
 *
 * const t = useTranslations();
 * const signupSchema = createSignupSchema((key) => t(key));
 * ```
 *
 * Note: The original static schemas in auth.schema.ts remain available
 * as fallback/reference and for server-side usage where translations
 * may not be needed.
 */

import * as yup from 'yup';

/**
 * Translation function type
 * Accepts a translation key and returns the translated string
 */
type TranslationFunction = (key: string) => string;

/**
 * Email Field Factory
 *
 * Creates an email field validator with translated error messages.
 * Validates email format and normalizes the value by:
 * - Converting to lowercase
 * - Trimming whitespace
 *
 * @param t - Translation function
 * @returns Configured email field validator
 */
export const createEmailField = (t: TranslationFunction) =>
  yup
    .string()
    .email(t('auth.validation.email.invalid'))
    .lowercase()
    .trim();

/**
 * Password Field Factory
 *
 * Creates a password field validator with translated error messages.
 * Enforces password strength requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 *
 * Note: This should NOT be used for login validation to avoid
 * rejecting existing users with weaker passwords.
 *
 * @param t - Translation function
 * @returns Configured password field validator
 */
export const createPasswordField = (t: TranslationFunction) =>
  yup
    .string()
    .min(8, t('auth.validation.password.minLength'))
    .matches(/[A-Z]/, t('auth.validation.password.uppercase'))
    .matches(/[0-9]/, t('auth.validation.password.number'));

/**
 * Signup Schema Factory
 *
 * Creates a signup validation schema with translated error messages.
 * Validates new user registration with:
 * - Valid email format (lowercase, trimmed)
 * - Strong password (8+ chars, uppercase, number)
 * - Matching password confirmation
 *
 * @param t - Translation function
 * @returns Configured signup validation schema
 *
 * @example
 * ```tsx
 * const t = useTranslations();
 * const schema = createSignupSchema((key) => t(key));
 * const resolver = yupResolver(schema);
 * ```
 */
export const createSignupSchema = (t: TranslationFunction) =>
  yup.object({
    email: createEmailField(t).required(t('auth.validation.email.required')),
    password: createPasswordField(t).required(t('auth.validation.password.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('auth.validation.password.mustMatch'))
      .required(t('auth.validation.password.confirmRequired')),
  });

/**
 * Login Schema Factory
 *
 * Creates a login validation schema with translated error messages.
 * Validates login credentials with minimal requirements:
 * - Valid email format
 * - Password presence (no strength validation)
 *
 * We don't validate password strength on login to avoid
 * rejecting existing users with weaker passwords.
 *
 * @param t - Translation function
 * @returns Configured login validation schema
 *
 * @example
 * ```tsx
 * const t = useTranslations();
 * const schema = createLoginSchema((key) => t(key));
 * ```
 */
export const createLoginSchema = (t: TranslationFunction) =>
  yup.object({
    email: createEmailField(t).required(t('auth.validation.email.required')),
    password: yup.string().required(t('auth.validation.password.required')),
  });

/**
 * Reset Password Request Schema Factory
 *
 * Creates a password reset request validation schema with translated error messages.
 * Validates password reset request with:
 * - Valid email format only
 *
 * Used when user requests a password reset link.
 *
 * @param t - Translation function
 * @returns Configured reset password request validation schema
 *
 * @example
 * ```tsx
 * const t = useTranslations();
 * const schema = createResetPasswordRequestSchema((key) => t(key));
 * ```
 */
export const createResetPasswordRequestSchema = (t: TranslationFunction) =>
  yup.object({
    email: createEmailField(t).required(t('auth.validation.email.required')),
  });

/**
 * Reset Password Schema Factory
 *
 * Creates a password reset validation schema with translated error messages.
 * Validates password reset form with:
 * - Strong new password (8+ chars, uppercase, number)
 * - Matching password confirmation
 *
 * Used when user sets a new password via reset link.
 *
 * @param t - Translation function
 * @returns Configured reset password validation schema
 *
 * @example
 * ```tsx
 * const t = useTranslations();
 * const schema = createResetPasswordSchema((key) => t(key));
 * ```
 */
export const createResetPasswordSchema = (t: TranslationFunction) =>
  yup.object({
    password: createPasswordField(t).required(t('auth.validation.password.required')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('auth.validation.password.mustMatch'))
      .required(t('auth.validation.password.confirmRequired')),
  });

/**
 * Update Profile Schema Factory
 *
 * Creates a profile update validation schema with translated error messages.
 * Validates profile update with optional fields:
 * - Email (optional, but must be valid if provided)
 * - Password (optional, but must be strong if provided)
 * - Confirm password (required if password is provided)
 *
 * Includes a custom test to ensure at least one field is provided.
 *
 * Used when user updates their profile information.
 *
 * @param t - Translation function
 * @returns Configured update profile validation schema
 *
 * @example
 * ```tsx
 * const t = useTranslations();
 * const schema = createUpdateProfileSchema((key) => t(key));
 * ```
 */
export const createUpdateProfileSchema = (t: TranslationFunction) =>
  yup.object({
    email: createEmailField(t).optional(),
    password: createPasswordField(t).optional(),
    confirmPassword: yup
      .string()
      .when('password', {
        is: (password: string | undefined) => password && password.length > 0,
        then: (schema) => schema
          .oneOf([yup.ref('password')], t('auth.validation.password.mustMatch'))
          .required(t('auth.validation.password.confirmRequired')),
        otherwise: (schema) => schema.optional(),
      }),
  }).test(
    'at-least-one-field',
    t('auth.validation.profile.atLeastOneField'),
    (value) => !!(value.email || value.password)
  );

/**
 * Inferred TypeScript types from factory schemas
 *
 * These types are automatically generated from the Yup schemas
 * and ensure type safety when using these schemas in forms
 * and server actions.
 *
 * Note: Since factories return schemas dynamically, we infer types
 * from a dummy translation function for type consistency.
 */
const dummyT = (key: string) => key;

export type SignupInput = yup.InferType<ReturnType<typeof createSignupSchema>>;
export type LoginInput = yup.InferType<ReturnType<typeof createLoginSchema>>;
export type ResetPasswordRequestInput = yup.InferType<ReturnType<typeof createResetPasswordRequestSchema>>;
export type ResetPasswordInput = yup.InferType<ReturnType<typeof createResetPasswordSchema>>;
export type UpdateProfileInput = yup.InferType<ReturnType<typeof createUpdateProfileSchema>>;
