/**
 * Get Store Public Data — Service Layer
 *
 * Business logic for retrieving a store's public data.
 * Validates the store exists and is accessible.
 *
 * Future: add checks for store status (active/suspended),
 * subscription validity, or geo-blocking here — without
 * touching the data or action layers.
 *
 * @param subdomain - The store subdomain to look up
 * @returns StorePublicData (store + theme)
 * @throws Error if store is not found
 */
import { STORE_ERROR_MESSAGES } from '@/features/stores/constants/messages';
import { getStorePublicDataData } from '@/features/stores/data';
import type { StorePublicData } from '@/features/stores/types';

export async function getStorePublicDataService(
    subdomain: string
): Promise<StorePublicData> {
    const data = await getStorePublicDataData(subdomain);

    if (!data) {
        throw new Error(STORE_ERROR_MESSAGES.NOT_FOUND);
    }

    return data;
}
