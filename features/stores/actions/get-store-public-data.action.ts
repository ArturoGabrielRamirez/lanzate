'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES } from '@/features/stores/constants';
import { getStorePublicDataService } from '@/features/stores/services';
import type { StorePublicData } from '@/features/stores/types';

/**
 * Get Store Public Data Server Action
 *
 * Entry point for fetching a store and its theme from public
 * storefront pages. Follows the action -> service -> data pattern.
 *
 * Flow:
 * 1. Validate subdomain is provided
 * 2. Call getStorePublicDataService to fetch store and theme data
 * 3. Return ServerResponse with store public data
 *
 * @param subdomain - The store subdomain to look up
 * @returns ServerResponse wrapping StorePublicData
 *
 * @example
 * ```tsx
 * const result = await getStorePublicDataAction('my-store');
 * if (!result.hasError && result.payload) {
 *   const { store, theme } = result.payload;
 * }
 * ```
 */
export async function getStorePublicDataAction(subdomain: string) {
  return actionWrapper<StorePublicData>(async () => {
    if (!subdomain || subdomain.trim() === '') {
      throw new Error(STORE_ERROR_MESSAGES.SUBDOMAIN_REQUIRED);
    }

    const data = await getStorePublicDataService(subdomain.toLowerCase());

    return formatSuccess(STORE_SUCCESS_MESSAGES.PUBLIC_DATA_FETCHED, data);
  });
}
