'use server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
import { getOwnedStoreBySubdomainData } from '@/features/stores/data/get-owned-store-by-subdomain.data';

import type { Store } from '@prisma/client';

/**
 * Get Store Detail Server Action
 *
 * Fetches a store by subdomain, verifying the authenticated user is the owner.
 * Used on the store detail page in the private area.
 *
 * @param subdomain - The subdomain of the store to fetch
 * @returns ServerResponse with store data or error
 */
export async function getStoreDetailAction(subdomain: string) {
  return actionWrapper<Store | null>(async () => {
    // Validate subdomain is provided
    if (!subdomain || subdomain.trim() === '') {
      return formatError('Subdomain is required');
    }

    // Get authenticated user
    const authUser = await getAuthUser();

    if (!authUser) {
      return formatError('User not authenticated');
    }

    // Get database user
    const dbUser = await getUserBySupabaseId(authUser.id);

    // Fetch store with ownership verification
    const store = await getOwnedStoreBySubdomainData(
      subdomain.toLowerCase(),
      dbUser.id
    );

    if (!store) {
      return formatError('Store not found');
    }

    return formatSuccess('Store found', store);
  });
}
