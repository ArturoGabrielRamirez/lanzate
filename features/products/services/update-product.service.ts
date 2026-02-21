/**
 * Update Product Service
 *
 * Business logic for updating a product with variants, attributes,
 * images, digital product data, and inventory.
 *
 * Responsibilities:
 * - Validates attribute limits per subscription tier
 * - Updates product basic info
 * - Handles attribute/variant/image updates (add, update, delete)
 * - Updates digital product data when applicable
 *
 * @param productId - The ID of the product to update
 * @param input - Product update input
 * @param userId - The ID of the user updating the product (for validation)
 * @returns The updated product with all relations
 */

import { AccountType } from '@prisma/client';

import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { updateFullProductData } from '@/features/products/data';
import type {
  UpdateFullProductInput,
  ProductWithAllRelations,
} from '@/features/products/types/product.types';
import { hasExceededAttributeLimit } from '@/features/subscriptions/config';
import { getUserSubscriptionData } from '@/features/subscriptions/data';

export async function updateProductService(
  productId: string,
  input: UpdateFullProductInput,
  userId: string
): Promise<ProductWithAllRelations> {
  // Get user's subscription to determine account type
  const subscription = await getUserSubscriptionData(userId);
  const accountType = subscription?.accountType ?? AccountType.FREE;

  // Validate attribute limits if updating attributes
  if (input.attributes) {
    const attributeCount = input.attributes.length;
    if (hasExceededAttributeLimit(accountType, attributeCount)) {
      const errorKey = accountType === AccountType.FREE
        ? PRODUCT_ERROR_MESSAGES.ATTRIBUTE_LIMIT_FREE
        : accountType === AccountType.PRO
          ? PRODUCT_ERROR_MESSAGES.ATTRIBUTE_LIMIT_PRO
          : PRODUCT_ERROR_MESSAGES.ATTRIBUTE_LIMIT_EXCEEDED;
      throw new Error(errorKey);
    }
  }

  // Update product via data layer
  return await updateFullProductData(productId, input);
}
