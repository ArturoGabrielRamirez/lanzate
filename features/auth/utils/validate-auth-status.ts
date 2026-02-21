/**
 * Validate Auth Status Utility
 *
 * Provides a lightweight check to ensure the user has an active session.
 * Uses supabase.auth.getSession() which is faster than getUser() as it
 * primarily checks the local session/cookie.
 *
 * This should be used for actions that only need to confirm authentication
 * before proceeding, without needing full user details or high security.
 */

import { AUTH_ERROR_MESSAGES } from '@/features/auth/constants';
import { createClient } from '@/lib/supabase/server';

/**
 * Validates if the user is authenticated.
 * Throws an error if no active session is found.
 *
 * @param errorMessage - Optional custom error message key
 * @returns The current Supabase session
 * @throws Error if not authenticated
 */
export async function validateAuthStatus(
    errorMessage: string = AUTH_ERROR_MESSAGES.NOT_AUTHENTICATED
) {
    const supabase = await createClient();
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error) {
        throw new Error(error.message);
    }

    if (!session) {
        throw new Error(errorMessage);
    }

    return session;
}
