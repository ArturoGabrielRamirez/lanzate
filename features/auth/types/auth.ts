/**
 * Authentication Types
 *
 * This file contains type definitions for authentication-related
 * data structures, sessions, and component props.
 *
 * These types ensure type safety across the authentication feature.
 */

import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

/**
 * User type matching the database schema
 *
 * Represents a user record as stored in the Prisma database
 */
export type User = {
  id: string;
  supabaseId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Auth Session type
 *
 * Wraps Supabase's session type for type safety
 * across the application
 */
export type AuthSession = SupabaseSession;

/**
 * Auth User type
 *
 * Wraps Supabase's user type for authentication-related
 * operations
 */
export type AuthUser = SupabaseUser;

/**
 * Login Form Props
 *
 * Props for the LoginForm component
 */
export type LoginFormProps = {
  redirectTo?: string;
  className?: string;
};

/**
 * Signup Form Props
 *
 * Props for the SignupForm component
 */
export type SignupFormProps = {
  redirectTo?: string;
  className?: string;
};

/**
 * Password Reset Request Form Props
 *
 * Props for the PasswordResetRequestForm component
 */
export type PasswordResetRequestFormProps = {
  className?: string;
};

/**
 * Password Reset Form Props
 *
 * Props for the PasswordResetForm component
 */
export type PasswordResetFormProps = {
  className?: string;
};

/**
 * Profile Edit Form Props
 *
 * Props for the ProfileEditForm component
 */
export type ProfileEditFormProps = {
  user: User;
  className?: string;
};

/**
 * Google Auth Button Props
 *
 * Props for the GoogleAuthButton component
 */
export type GoogleAuthButtonProps = {
  className?: string;
  label?: string;
};

/**
 * Auth Card Props
 *
 * Props for the AuthCard wrapper component
 */
export type AuthCardProps = {
  children: React.ReactNode;
  heading?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
};
