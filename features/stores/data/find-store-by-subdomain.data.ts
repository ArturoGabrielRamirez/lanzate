/**
 * Find Store by Subdomain Data Function
 *
 * Pure database operation to retrieve a store by its subdomain.
 * Does NOT contain business logic - only database interaction.
 *
 * @param subdomain - The subdomain to search for
 * @returns The store record if found, null otherwise
 *
 * @example
 * const store = await findStoreBySubdomainData('my-store');
 * if (!store) {
 *   // Handle store not found
 * }
 */
import { prisma } from '@/lib/prisma';

import type { Store } from '@prisma/client';

export async function findStoreBySubdomainData(
  subdomain: string
): Promise<Store | null> {
  const store = await prisma.store.findUnique({
    where: { subdomain },
  });

  return store;
}
