'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { deleteProductService } from '@/features/products/services';

/**
 * Delete Product Server Action
 *
 * Deletes a product and all related data (cascade delete).
 *
 * @param productId - The product ID to delete
 * @param storeId - The store ID (for ownership validation)
 * @returns ServerResponse with success message or error
 */
export async function deleteProductAction(productId: string, storeId: string) {
  return actionWrapper<{ deleted: boolean }>(async () => {
    await deleteProductService(productId, storeId);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess('Producto eliminado exitosamente', { deleted: true });
  });
}
