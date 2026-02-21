'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getInventoryStatusService } from '@/features/products/services/get-inventory-status.service';
import type { InventoryStatusResponse } from '@/features/products/types/product.types';

/**
 * Get Inventory Status Server Action
 *
 * Fetches the current inventory status for a specific product variant
 * at a specific branch location.
 *
 * Flow:
 * 1. Call getInventoryStatusService with variantId and branchId
 * 2. Return inventory state (in_stock, low_stock, out_of_stock) with quantity details
 *
 * @param variantId - The product variant ID to check inventory for
 * @param branchId - The branch/location ID to check inventory at
 * @returns ServerResponse with inventory status or null if not found
 *
 * @example
 * ```tsx
 * const result = await getInventoryStatusAction('variant-id', 'branch-id');
 * if (!result.hasError && result.payload) {
 *   console.log('Status:', result.payload.status);
 *   console.log('Quantity:', result.payload.quantity);
 * }
 * ```
 */
export async function getInventoryStatusAction(
  variantId: string,
  branchId: string
) {
  return actionWrapper<InventoryStatusResponse | null>(async () => {
    const result = await getInventoryStatusService(variantId, branchId);

    if (!result) {
      return formatSuccess(PRODUCT_SUCCESS_MESSAGES.INVENTORY_FETCHED, null);
    }

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.INVENTORY_FETCHED, result);
  });
}
