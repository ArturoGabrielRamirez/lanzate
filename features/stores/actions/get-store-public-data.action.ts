'use server';

/**
 * Get Store Public Data — Server Action
 *
 * Entry point for fetching a store and its theme from public
 * storefront pages. Follows the action → service → data pattern.
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
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
import { getStorePublicDataService } from '@/features/stores/services';
import type { StorePublicData } from '@/features/stores/types';

export async function getStorePublicDataAction(subdomain: string) {
    return actionWrapper<StorePublicData>(async () => {
        if (!subdomain || subdomain.trim() === '') {
            return formatError('Subdomain is required');
        }

        const data = await getStorePublicDataService(subdomain.toLowerCase());
        return formatSuccess('Store data fetched successfully', data);
    });
}
