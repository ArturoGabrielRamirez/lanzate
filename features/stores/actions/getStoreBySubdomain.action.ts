'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
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
 * 3. Return success with store data or error if not found
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
    // Validate subdomain is provided
    if (!subdomain || subdomain.trim() === '') {
      return formatError('Subdomain is required');
    }

    // Fetch store from database
    const store = await findStoreBySubdomainData(subdomain.toLowerCase());

    if (!store) {
      return formatError('Store not found');
    }

    return formatSuccess('Store found', store);
  });
}
