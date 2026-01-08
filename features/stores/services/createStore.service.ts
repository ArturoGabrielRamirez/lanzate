/**
 * Create Store Service
 *
 * Business logic for creating a new store with account-type-based limits.
 * - Retrieves user's subscription to determine account type
 * - Enforces store creation limits: FREE=2, PRO=5, ENTERPRISE=unlimited
 * - Transforms subdomain to lowercase
 * - Creates store record if limit not reached
 *
 * @param input - Store creation input (name, description, subdomain)
 * @param userId - The ID of the user creating the store
 * @returns The created store record
 * @throws Error if store limit reached for account type
 *
 * @example
 * const store = await createStoreService({
 *   name: 'My Store',
 *   description: 'A great store',
 *   subdomain: 'my-store'
 * }, 'user-id-123');
 */
import { AccountType } from '@prisma/client';

import { createStoreData, countUserStoresData } from '@/features/stores/data';
import type { CreateStoreInput } from '@/features/stores/schemas/schemaFactory';
import { getUserSubscriptionData } from '@/features/subscriptions/data';

import type { Store } from '@prisma/client';

export async function createStoreService(
  input: CreateStoreInput,
  userId: string
): Promise<Store> {
  // Get user's subscription to determine account type
  const subscription = await getUserSubscriptionData(userId);

  // Default to FREE if no subscription
  const accountType = subscription?.accountType ?? AccountType.FREE;

  // Count user's current stores
  const currentStoreCount = await countUserStoresData(userId);

  // Check store limits based on account type
  let limitReached = false;
  let errorMessage = '';

  switch (accountType) {
    case AccountType.FREE:
      if (currentStoreCount >= 2) {
        limitReached = true;
        errorMessage = 'errors.store.limitReached.free';
      }
      break;
    case AccountType.PRO:
      if (currentStoreCount >= 5) {
        limitReached = true;
        errorMessage = 'errors.store.limitReached.pro';
      }
      break;
    case AccountType.ENTERPRISE:
      // No limit for ENTERPRISE users
      limitReached = false;
      break;
  }

  // Throw error if limit reached
  if (limitReached) {
    throw new Error(errorMessage);
  }

  // Transform subdomain to lowercase
  const transformedInput = {
    ...input,
    subdomain: input.subdomain.toLowerCase(),
  };

  // Create the store
  const store = await createStoreData(transformedInput, userId);

  return store;
}
