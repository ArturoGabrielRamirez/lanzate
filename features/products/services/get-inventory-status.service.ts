import { getInventoryData } from '@/features/products/data/get-inventory.data';
import type { InventoryStatus, InventoryStatusResponse } from '@/features/products/types/product.types';

/**
 * Business logic for inventory status calculation
 * - Determines in_stock/low_stock/out_of_stock based on quantity
 * - Returns formatted inventory status response
 */
export async function getInventoryStatusService(
  variantId: string,
  branchId: string
): Promise<InventoryStatusResponse | null> {
  const inventory = await getInventoryData(variantId, branchId);

  if (!inventory) {
    return null;
  }

  let status: InventoryStatus;

  if (inventory.quantity === 0) {
    status = 'out_of_stock';
  } else if (inventory.quantity <= inventory.lowStockThreshold) {
    status = 'low_stock';
  } else {
    status = 'in_stock';
  }

  return {
    status,
    quantity: inventory.quantity,
    lowStockThreshold: inventory.lowStockThreshold,
  };
}
