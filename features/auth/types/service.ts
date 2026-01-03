/**
 * Auth Service Layer Types
 *
 * Type definitions for auth service layer functions.
 */

export interface CreateUserServiceParams {
  email: string;
  supabaseId: string;
}

export interface ValidateCredentialsParams {
  email: string;
  password: string;
}

export interface UpdateUserProfileParams {
  email?: string;
  password?: string;
}
