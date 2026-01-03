/**
 * Auth Data Layer Types
 *
 * Type definitions for auth data layer functions.
 */

export interface CreateUserParams {
  email: string;
  username: string;
  supabaseId: string;
}

export interface UpdateUserParams {
  email?: string;
  username?: string;
}
