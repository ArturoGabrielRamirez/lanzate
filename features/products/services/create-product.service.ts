/**
 * Create Product Service
 *
 * Business logic for creating a complete product with variants, attributes,
 * images, digital product data, and initial inventory.
 *
 * Responsibilities:
 * - Validates attribute limits per subscription tier (FREE: 5, PRO: 50, ENTERPRISE: unlimited)
 * - Creates product with all related data in a transaction
 * - Handles digital product creation when is_digital flag is set
 * - Orchestrates product with variants, images, and inventory
 *
 * @param input - Full product creation input
 * @param userId - The ID of the user creating the product (store owner)
 * @returns The created product with all relations
 * @throws Error if attribute limit exceeded for account type
 */

import { AccountType } from '@prisma/client';

import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { createFullProductData } from '@/features/products/data';
import type {
  CreateFullProductInput,
  ProductWithAllRelations,
} from '@/features/products/types/product.types';
import { hasExceededAttributeLimit } from '@/features/subscriptions/config';
import { getUserSubscriptionData } from '@/features/subscriptions/data';

export async function createProductService(
  input: CreateFullProductInput,
  userId: string
): Promise<ProductWithAllRelations> {
  // Get user's subscription to determine account type
  const subscription = await getUserSubscriptionData(userId);
  const accountType = subscription?.accountType ?? AccountType.FREE;

  // Validate attribute limits
  const attributeCount = input.attributes?.length ?? 0;
  if (hasExceededAttributeLimit(accountType, attributeCount)) {
    const errorKey = accountType === AccountType.FREE
      ? PRODUCT_ERROR_MESSAGES.ATTRIBUTE_LIMIT_FREE
      : accountType === AccountType.PRO
        ? PRODUCT_ERROR_MESSAGES.ATTRIBUTE_LIMIT_PRO
        : PRODUCT_ERROR_MESSAGES.ATTRIBUTE_LIMIT_EXCEEDED;
    throw new Error(errorKey);
  }

  // Create product with all related data via data layer
  return await createFullProductData(input);
}
