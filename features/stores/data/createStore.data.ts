/**
 * Create Store Data Function
 *
 * Pure database operation to insert a new store record.
 * Does NOT contain business logic - only database interaction.
 *
 * @param input - Store creation input (name, description, subdomain)
 * @param userId - The ID of the user who will own this store
 * @returns The created store record
 *
 * @example
 * const store = await createStoreData({
 *   name: 'My Store',
 *   description: 'A great store',
 *   subdomain: 'my-store'
 * }, 'user-id-123');
 */
import type { CreateStoreInput } from '@/features/stores/schemas/schemaFactory';
import { prisma } from '@/lib/prisma';

import type { Store } from '@prisma/client';

export async function createStoreData(
  input: CreateStoreInput,
  userId: string
): Promise<Store> {
  const store = await prisma.store.create({
    data: {
      ...input,
      ownerId: userId,
    },
  });

  return store;
}
