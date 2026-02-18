'use server';


import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
import { getOwnedStoreBySubdomainData } from '@/features/stores/data';

import type { Store } from '@prisma/client';

/**
 * Get Store Header Server Action
 *
 * Lightweight action that fetches only the store data needed
 * for the store header display (no products, no counts).
 *
 * @param subdomain - The subdomain of the store to fetch
 * @returns ServerResponse with store data or error
 */
export async function getStoreHeaderAction(subdomain: string) {
  return actionWrapper<Store | null>(async () => {
    if (!subdomain || subdomain.trim() === '') {
      return formatError('Subdomain is required');
    }

    const authUser = await getAuthUser();
    if (!authUser) {
      return formatError('User not authenticated');
    }

    const dbUser = await getUserBySupabaseId(authUser.id);
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
