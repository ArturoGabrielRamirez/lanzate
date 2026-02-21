'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getInventoryStatusService } from '@/features/products/services/get-inventory-status.service';
import type { InventoryStatusResponse } from '@/features/products/types/product.types';

/**
 * Server action to get inventory status
 * - Delegates to service layer for business logic
 * - Returns inventory state for variant/branch
 */
export async function getInventoryStatusAction(
  variantId: string,
  branchId: string
) {
  return actionWrapper<InventoryStatusResponse | null>(async () => {
    const result = await getInventoryStatusService(variantId, branchId);

    if (!result) {
      return formatSuccess('No se encontró inventario', null);
    }

    return formatSuccess('Estado de inventario obtenido exitosamente', result);
  });
}
