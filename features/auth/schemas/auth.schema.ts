/**
 * Authentication Validation Schemas
 *
 * This file composes complete validation schemas for all authentication
 * use cases by combining the reusable field validators from authFields.ts.
 *
 * Each schema is tailored to its specific use case:
 * - signupSchema: Full validation for new user registration
 * - loginSchema: Minimal validation (don't reject existing weak passwords)
 * - resetPasswordRequestSchema: Email-only validation
 * - resetPasswordSchema: Password validation for reset flow
 * - updateProfileSchema: Optional email and password validation for profile updates
 *
 * Types are automatically inferred from schemas using yup.InferType
 * to ensure type safety across the application.
 */

import * as yup from 'yup';

import { emailField, passwordField } from '@/features/auth/schemas/authFields';

/**
 * Signup Schema
 *
 * Validates new user registration with:
 * - Valid email format (lowercase, trimmed)
 * - Strong password (8+ chars, uppercase, number)
 * - Matching password confirmation
 */
export const signupSchema = yup.object({
  email: emailField.required('El email es obligatorio'),
  password: passwordField.required('La contraseña es obligatoria'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
});

/**
 * Login Schema
 *
 * Validates login credentials with minimal requirements:
 * - Valid email format
 * - Password presence (no strength validation)
 *
 * We don't validate password strength on login to avoid
 * rejecting existing users with weaker passwords
 */
export const loginSchema = yup.object({
  email: emailField.required('El email es obligatorio'),
  password: yup.string().required('La contraseña es obligatoria'),
});

/**
 * Password Reset Request Schema
 *
 * Validates password reset request with:
 * - Valid email format only
 *
 * Used when user requests a password reset link
 */
export const resetPasswordRequestSchema = yup.object({
  email: emailField.required('El email es obligatorio'),
});

/**
 * Password Reset Schema
 *
 * Validates password reset form with:
 * - Strong new password (8+ chars, uppercase, number)
 * - Matching password confirmation
 *
 * Used when user sets a new password via reset link
 */
export const resetPasswordSchema = yup.object({
  password: passwordField.required('La contraseña es obligatoria'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
});

/**
 * Update Profile Schema
 *
 * Validates profile update with optional fields:
 * - Email (optional, but must be valid if provided)
 * - Password (optional, but must be strong if provided)
 * - Confirm password (required if password is provided)
 *
 * Used when user updates their profile information
 */
export const updateProfileSchema = yup.object({
  email: emailField.optional(),
  password: passwordField.optional(),
  confirmPassword: yup
    .string()
    .when('password', {
      is: (password: string | undefined) => password && password.length > 0,
      then: (schema) => schema
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Debes confirmar la contraseña'),
      otherwise: (schema) => schema.optional(),
    }),
}).test(
  'at-least-one-field',
  'Debes proporcionar al menos un campo para actualizar',
  (value) => !!(value.email || value.password)
);

/**
 * Inferred TypeScript types from schemas
 *
 * These types are automatically generated from the Yup schemas
 * and ensure type safety when using these schemas in forms
 * and server actions
 */
export type SignupInput = yup.InferType<typeof signupSchema>;
export type LoginInput = yup.InferType<typeof loginSchema>;
export type ResetPasswordRequestInput = yup.InferType<typeof resetPasswordRequestSchema>;
export type ResetPasswordInput = yup.InferType<typeof resetPasswordSchema>;
export type UpdateProfileInput = yup.InferType<typeof updateProfileSchema>;
