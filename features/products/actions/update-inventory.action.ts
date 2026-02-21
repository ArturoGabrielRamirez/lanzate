'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { inventoryUpdateSchema, type InventoryUpdateInput } from '@/features/products/schemas';
import { updateInventoryService } from '@/features/products/services/update-inventory.service';
import { createClient } from '@/lib/supabase/server';

import type { VariantInventory } from '@prisma/client';

/**
 * Update Inventory Server Action
 *
 * Updates inventory quantity and low stock threshold for a product variant
 * at a specific branch location.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Validate input with inventoryUpdateSchema
 * 3. Call updateInventoryService to persist inventory changes
 * 4. Revalidate product list path
 * 5. Return updated inventory record
 *
 * @param input - Inventory update input (variantId, branchId, quantity, lowStockThreshold)
 * @returns ServerResponse with updated inventory record or error
 *
 * @example
 * ```tsx
 * const result = await updateInventoryAction({
 *   variantId: 'variant-id',
 *   branchId: 'branch-id',
 *   quantity: 50,
 *   lowStockThreshold: 5
 * });
 * if (!result.hasError) {
 *   console.log('Inventory updated:', result.payload.quantity);
 * }
 * ```
 */
export async function updateInventoryAction(input: InventoryUpdateInput) {
  return actionWrapper<VariantInventory>(async () => {
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error(PRODUCT_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    await inventoryUpdateSchema.validate(input, { abortEarly: false });

    const result = await updateInventoryService(input, authUser.id);

    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.INVENTORY_UPDATED, result);
  });
}
