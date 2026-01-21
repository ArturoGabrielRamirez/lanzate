'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import {
  bulkDeleteProductsService,
  bulkUpdateProductStatusService,
} from '@/features/products/services';

/**
 * Bulk operation types for products
 */
export type BulkProductOperation =
  | { type: 'delete' }
  | { type: 'archive' }
  | { type: 'activate' }
  | { type: 'draft' }
  | { type: 'status'; status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' };

/**
 * Bulk Update Products Server Action
 *
 * Handles bulk operations on multiple products:
 * - Bulk delete: Permanently removes products
 * - Bulk archive: Sets status to ARCHIVED
 * - Bulk activate: Sets status to ACTIVE
 * - Bulk draft: Sets status to DRAFT
 * - Bulk status: Sets custom status
 *
 * @param productIds - Array of product IDs to operate on
 * @param storeId - The store ID (for ownership validation)
 * @param operation - The bulk operation to perform
 * @returns ServerResponse with count of affected products
 */
export async function bulkUpdateProductsAction(
  productIds: string[],
  storeId: string,
  operation: BulkProductOperation
) {
  return actionWrapper<{ count: number }>(async () => {
    if (productIds.length === 0) {
      throw new Error('Debes seleccionar al menos un producto');
    }

    let count: number;
    let message: string;

    switch (operation.type) {
      case 'delete':
        count = await bulkDeleteProductsService(productIds, storeId);
        message = `${count} producto(s) eliminado(s) exitosamente`;
        break;

      case 'archive':
        count = await bulkUpdateProductStatusService(productIds, storeId, 'ARCHIVED');
        message = `${count} producto(s) archivado(s) exitosamente`;
        break;

      case 'activate':
        count = await bulkUpdateProductStatusService(productIds, storeId, 'ACTIVE');
        message = `${count} producto(s) activado(s) exitosamente`;
        break;

      case 'draft':
        count = await bulkUpdateProductStatusService(productIds, storeId, 'DRAFT');
        message = `${count} producto(s) marcado(s) como borrador`;
        break;

      case 'status':
        count = await bulkUpdateProductStatusService(productIds, storeId, operation.status);
        message = `${count} producto(s) actualizado(s) exitosamente`;
        break;

      default:
        throw new Error('Operación no válida');
    }

    // Revalidate product list
    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess(message, { count });
  });
}
