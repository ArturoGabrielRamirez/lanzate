/**
 * Get Owned Store by ID Data Function
 *
 * Pure database operation to retrieve a store by its ID,
 * verifying that the specified user is the owner.
 *
 * @param storeId - The store ID to search for
 * @param ownerId - The owner's database ID to verify ownership
 * @returns The store record if found and owned by user, null otherwise
 */
import { prisma } from '@/lib/prisma';

import type { Store } from '@prisma/client';

export async function getOwnedStoreByIdData(
  storeId: string,
  ownerId: string
): Promise<Store | null> {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      ownerId,
    },
  });

  return store;
}
