'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES } from '@/features/stores/constants';
import { findStoreBySubdomainData } from '@/features/stores/data';

import type { Store } from '@prisma/client';

/**
 * Get Store by Subdomain Server Action
 *
 * Fetches a store by its subdomain for storefront routing.
 * Used by the placeholder storefront page to verify store existence.
 *
 * Flow:
 * 1. Validate subdomain is provided
 * 2. Call findStoreBySubdomainData to fetch store from database
 * 3. Validate store was found
 * 4. Return success with store data
 *
 * @param subdomain - The subdomain to search for
 * @returns ServerResponse with store data or error
 *
 * @example
 * ```tsx
 * const result = await getStoreBySubdomainAction('my-store');
 *
 * if (!result.hasError && result.payload) {
 *   // Store found
 *   console.log(result.payload.name);
 * }
 * ```
 */
export async function getStoreBySubdomainAction(subdomain: string) {
  return actionWrapper<Store | null>(async () => {
    if (!subdomain || subdomain.trim() === '') {
      throw new Error(STORE_ERROR_MESSAGES.SUBDOMAIN_REQUIRED);
    }

    const store = await findStoreBySubdomainData(subdomain.toLowerCase());

    if (!store) {
      throw new Error(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    return formatSuccess(STORE_SUCCESS_MESSAGES.FOUND, store);
  });
}
