/**
 * Create Store Service
 *
 * Business logic for creating a new store with account-type-based limits.
 * - Retrieves user's subscription to determine account type
 * - Enforces store creation limits using centralized ACCOUNT_LIMITS config
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
import { hasReachedStoreLimit } from '@/features/subscriptions/config';
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

  // Check store limits using centralized config
  if (hasReachedStoreLimit(accountType, currentStoreCount)) {
    const errorKey =
      accountType === AccountType.FREE
        ? 'errors.store.limitReached.free'
        : 'errors.store.limitReached.pro';
    throw new Error(errorKey);
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
