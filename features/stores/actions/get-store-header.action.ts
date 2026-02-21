'use server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES } from '@/features/stores/constants';
import { getOwnedStoreBySubdomainData } from '@/features/stores/data';

import type { Store } from '@prisma/client';

/**
 * Get Store Header Server Action
 *
 * Lightweight action that fetches only the store data needed
 * for the store header display (no products, no counts).
 *
 * Flow:
 * 1. Validate subdomain is provided
 * 2. Get authenticated user via getAuthUser
 * 3. Fetch database user record by Supabase ID
 * 4. Fetch store with ownership verification via getOwnedStoreBySubdomainData
 * 5. Return store data for header
 *
 * @param subdomain - The subdomain of the store to fetch
 * @returns ServerResponse with store data or error
 *
 * @example
 * ```tsx
 * const result = await getStoreHeaderAction('my-store');
 * if (!result.hasError && result.payload) {
 *   console.log('Store:', result.payload.name);
 * }
 * ```
 */
export async function getStoreHeaderAction(subdomain: string) {
  return actionWrapper<Store | null>(async () => {
    if (!subdomain || subdomain.trim() === '') {
      throw new Error(STORE_ERROR_MESSAGES.SUBDOMAIN_REQUIRED);
    }

    const authUser = await getAuthUser();

    if (!authUser) {
      throw new Error(STORE_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const dbUser = await getUserBySupabaseId(authUser.id);

    const store = await getOwnedStoreBySubdomainData(
      subdomain.toLowerCase(),
      dbUser.id
    );

    if (!store) {
      throw new Error(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    return formatSuccess(STORE_SUCCESS_MESSAGES.FOUND, store);
  });
}
