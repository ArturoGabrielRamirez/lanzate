'use server';

import { requireAuth } from '@/features/auth/utils';
import { getUserStoreData } from '@/features/global/data/get-user-store.data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getBundlesData } from '@/features/products/data/get-bundles.data';

import type { ProductBundle } from '@prisma/client';

/**
 * Get Bundles Server Action
 *
 * Retrieves all product bundles for the authenticated user's store.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Fetch user's store via getUserStoreData
 * 3. Validate store exists
 * 4. Fetch all bundles for the store via getBundlesData
 * 5. Return bundles list
 *
 * @returns ServerResponse with array of product bundles or error
 *
 * @example
 * ```tsx
 * const result = await getBundlesAction();
 * if (!result.hasError && result.payload) {
 *   console.log('Bundles:', result.payload.length);
 * }
 * ```
 */
export async function getBundlesAction() {
  return actionWrapper<ProductBundle[]>(async () => {
    const { authUser } = await requireAuth(PRODUCT_ERROR_MESSAGES.NOT_AUTHENTICATED);

    const store = await getUserStoreData(authUser.id);

    if (!store) {
      throw new Error(PRODUCT_ERROR_MESSAGES.STORE_NOT_FOUND);
    }

    const bundles = await getBundlesData(store.id);

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.BUNDLES_FETCHED, bundles);
  });
}
