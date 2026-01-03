/**
 * Reusable Authentication Field Validators
 *
 * This file contains base validation rules for individual fields
 * used across multiple authentication schemas. By extracting these
 * as reusable validators, we follow DRY principles and ensure
 * consistent validation rules across all auth flows.
 *
 * These fields are composed into complete schemas in auth.schema.ts
 */

import * as yup from 'yup';

/**
 * Email field validator
 *
 * Validates email format and normalizes the value by:
 * - Converting to lowercase
 * - Trimming whitespace
 *
 * This ensures consistent email storage and comparison
 */
export const emailField = yup
  .string()
  .email('Email inválido')
  .lowercase()
  .trim();

/**
 * Password field validator for signup and password reset
 *
 * Enforces password strength requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 *
 * Note: Login schema does NOT use this validator to avoid
 * rejecting existing users with weaker passwords
 */
export const passwordField = yup
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .matches(/[0-9]/, 'Debe contener al menos un número');
