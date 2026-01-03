/**
 * Validate Credentials Service
 *
 * Business logic for validating user credentials via Supabase Auth.
 * This service checks if the provided email and password are valid.
 *
 * @param params - Credentials to validate
 * @returns True if credentials are valid, false otherwise
 * @throws Error if Supabase authentication fails
 *
 * @example
 * const isValid = await validateCredentialsService({
 *   email: 'user@example.com',
 *   password: 'SecurePass123'
 * });
 * if (isValid) {
 *   console.log('Credentials are valid');
 * }
 */
import type { ValidateCredentialsParams } from '@/features/auth/types';
import { createClient } from '@/lib/supabase/server';

export async function validateCredentialsService(params: ValidateCredentialsParams): Promise<boolean> {
  const { email, password } = params;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // If there's an error, credentials are invalid
  if (error) {
    return false;
  }

  // Credentials are valid
  return true;
}
