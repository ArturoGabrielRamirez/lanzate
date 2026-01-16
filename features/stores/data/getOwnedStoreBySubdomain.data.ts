/**
 * Get Owned Store by Subdomain Data Function
 *
 * Pure database operation to retrieve a store by its subdomain,
 * verifying that the specified user is the owner.
 *
 * @param subdomain - The subdomain to search for
 * @param ownerId - The owner's database ID to verify ownership
 * @returns The store record if found and owned by user, null otherwise
 */
import { prisma } from '@/lib/prisma';

import type { Store } from '@prisma/client';

export async function getOwnedStoreBySubdomainData(
  subdomain: string,
  ownerId: string
): Promise<Store | null> {
  const store = await prisma.store.findFirst({
    where: {
      subdomain,
      ownerId,
    },
  });

  return store;
}
