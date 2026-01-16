/**
 * Delete Store Data
 *
 * Data layer function to delete a store from the database.
 * This is a pure database operation - ownership verification
 * should be done at the service layer.
 *
 * @param storeId - The store ID to delete
 * @throws Error if the store doesn't exist or deletion fails
 */

import { prisma } from '@/lib/prisma';

export async function deleteStoreData(storeId: string): Promise<void> {
  await prisma.store.delete({
    where: {
      id: storeId,
    },
  });
}
