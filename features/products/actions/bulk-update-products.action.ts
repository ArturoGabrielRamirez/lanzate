'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import {
  bulkDeleteProductsService,
  bulkUpdateProductStatusService,
} from '@/features/products/services';
import type { BulkProductOperation } from '@/features/products/types/product.types';

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
 * Flow:
 * 1. Validate at least one product ID is provided
 * 2. Execute the requested bulk operation via the appropriate service
 * 3. Revalidate product list path
 * 4. Return success response with affected product count
 *
 * @param productIds - Array of product IDs to operate on
 * @param storeId - The store ID (for ownership validation)
 * @param operation - The bulk operation to perform
 * @returns ServerResponse with count of affected products
 *
 * @example
 * ```tsx
 * const result = await bulkUpdateProductsAction(
 *   ['id1', 'id2'],
 *   'store-id',
 *   { type: 'archive' }
 * );
 * if (!result.hasError) {
 *   console.log(`${result.payload.count} products archived`);
 * }
 * ```
 */
export async function bulkUpdateProductsAction(
  productIds: string[],
  storeId: string,
  operation: BulkProductOperation
) {
  return actionWrapper<{ count: number }>(async () => {
    if (productIds.length === 0) {
      throw new Error(PRODUCT_ERROR_MESSAGES.BULK_NO_SELECTION);
    }

    let count: number;
    let message: string;

    switch (operation.type) {
      case 'delete':
        count = await bulkDeleteProductsService(productIds, storeId);
        message = PRODUCT_SUCCESS_MESSAGES.BULK_DELETE;
        break;

      case 'archive':
        count = await bulkUpdateProductStatusService(productIds, storeId, 'ARCHIVED');
        message = PRODUCT_SUCCESS_MESSAGES.BULK_ARCHIVE;
        break;

      case 'activate':
        count = await bulkUpdateProductStatusService(productIds, storeId, 'ACTIVE');
        message = PRODUCT_SUCCESS_MESSAGES.BULK_ACTIVATE;
        break;

      case 'draft':
        count = await bulkUpdateProductStatusService(productIds, storeId, 'DRAFT');
        message = PRODUCT_SUCCESS_MESSAGES.BULK_DRAFT;
        break;

      case 'status':
        count = await bulkUpdateProductStatusService(productIds, storeId, operation.status);
        message = PRODUCT_SUCCESS_MESSAGES.BULK_STATUS_UPDATE;
        break;

      default:
        throw new Error(PRODUCT_ERROR_MESSAGES.BULK_OPERATION_INVALID);
    }

    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess(message, { count });
  });
}
