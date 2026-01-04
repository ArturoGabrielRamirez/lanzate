/**
 * Authentication Types
 *
 * This file contains type definitions for authentication-related
 * data structures and sessions.
 *
 * These types ensure type safety across the authentication feature.
 *
 * Note: Component prop types are defined in components.ts
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
