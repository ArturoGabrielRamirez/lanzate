'use server';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES } from '@/features/stores/constants';
import {
  countStoreBranchesData,
  countStoreActiveProductsData,
  getOwnedStoreBySubdomainData,
  getStoreProductsPreviewData,
} from '@/features/stores/data';
import type { StoreDetailPageData } from '@/features/stores/types/store';

/**
 * Get Store Detail Page Server Action
 *
 * Fetches all data needed for the store detail page:
 * - Store with ownership verification
 * - Products preview with images and variants
 * - Active product count
 * - Branch count
 *
 * Flow:
 * 1. Validate subdomain is provided
 * 2. Get authenticated user via getAuthUser
 * 3. Fetch database user record by Supabase ID
 * 4. Fetch store with ownership verification
 * 5. Fetch products, product count, and branch count in parallel
 * 6. Return complete store detail page data
 *
 * @param subdomain - The subdomain of the store to fetch
 * @returns ServerResponse with complete store detail page data
 *
 * @example
 * ```tsx
 * const result = await getStoreDetailAction('my-store');
 * if (!result.hasError && result.payload) {
 *   const { store, products, productCount, branchCount } = result.payload;
 * }
 * ```
 */
export async function getStoreDetailAction(subdomain: string) {
  return actionWrapper<StoreDetailPageData | null>(async () => {
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

    const [products, productCount, branchCount] = await Promise.all([
      getStoreProductsPreviewData(store.id, 10),
      countStoreActiveProductsData(store.id),
      countStoreBranchesData(store.id),
    ]);

    return formatSuccess(STORE_SUCCESS_MESSAGES.DATA_LOADED, {
      store,
      products,
      productCount,
      branchCount,
    });
  });
}
