/**
 * Delete Store Service
 *
 * Business logic for deleting a store with ownership verification.
 * - Verifies the store exists
 * - Verifies the user owns the store
 * - Deletes the store record
 *
 * @param storeId - The ID of the store to delete
 * @param userId - The ID of the user requesting deletion
 * @throws Error if store not found or user is not the owner
 *
 * @example
 * await deleteStoreService('store-id-123', 'user-id-456');
 */

import { deleteStoreData } from '@/features/stores/data/delete-store.data';
import { getOwnedStoreByIdData } from '@/features/stores/data/get-owned-store-by-id.data';

export async function deleteStoreService(
  storeId: string,
  userId: string
): Promise<void> {
  // Verify store exists and user is the owner
  const store = await getOwnedStoreByIdData(storeId, userId);

  if (!store) {
    throw new Error('errors.store.notFoundOrNotOwned');
  }

  // Delete the store
  await deleteStoreData(storeId);
}
