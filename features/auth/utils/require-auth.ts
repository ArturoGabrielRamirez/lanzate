/**
 * Require Auth Utility
 *
 * A comprehensive utility for actions requiring full user context and security.
 * It first validates the session status, then performs a secure getUser() check
 * against Supabase, and finally retrieves the user record from the database.
 *
 * This utility ensures that:
 * 1. The user has a valid session.
 * 2. The user is currently valid in Supabase (not deleted/blocked).
 * 3. the user exists in our primary Prisma database.
 */

import { User } from '@supabase/supabase-js';

import { AUTH_ERROR_MESSAGES } from '@/features/auth/constants';
import { getUserBySupabaseId } from '@/features/auth/data';
import { UserWithStores } from '@/features/auth/types';
import { validateAuthStatus } from '@/features/auth/utils/validate-auth-status';
import { createClient } from '@/lib/supabase/server';

/**
 * Ensures the user is authenticated and exists in the database.
 * Returns both the Supabase auth user and the database user record.
 *
 * @param errorMessage - Optional custom error message key for auth failure
 * @returns Object containing authUser and dbUser
 * @throws Error if authentication fails or user not found in database
 */
export async function requireAuth(
    errorMessage: string = AUTH_ERROR_MESSAGES.NOT_AUTHENTICATED
): Promise<{
    authUser: User;
    dbUser: UserWithStores;
}> {
    // 1. Lightweight session check
    await validateAuthStatus(errorMessage);

    // 2. Secure Supabase user verification
    const supabase = await createClient();
    const {
        data: { user: authUser },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        throw new Error(authError.message);
    }

    if (!authUser) {
        throw new Error(errorMessage);
    }

    // 3. Database user retrieval
    const dbUser = await getUserBySupabaseId(authUser.id);

    return { authUser, dbUser };
}
