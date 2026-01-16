'use server';

import { revalidatePath } from 'next/cache';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatError, formatSuccess } from '@/features/global/utils/format-response';
import { deleteStoreService } from '@/features/stores/services/delete-store.service';

/**
 * Delete Store Server Action
 *
 * Deletes a store by ID, verifying the authenticated user is the owner.
 * Revalidates dashboard and stores pages after successful deletion.
 *
 * @param storeId - The ID of the store to delete
 * @returns ServerResponse with success or error message
 */
export async function deleteStoreAction(storeId: string) {
  return actionWrapper<null>(async () => {
    // Validate storeId is provided
    if (!storeId || storeId.trim() === '') {
      return formatError('Store ID is required');
    }

    // Get authenticated user
    const authUser = await getAuthUser();

    if (!authUser) {
      return formatError('User not authenticated');
    }

    // Get database user
    const dbUser = await getUserBySupabaseId(authUser.id);

    // Delete store (service handles ownership verification)
    await deleteStoreService(storeId, dbUser.id);

    // Revalidate affected pages
    revalidatePath('/[locale]/dashboard', 'page');
    revalidatePath('/[locale]/stores', 'page');

    return formatSuccess('Store deleted successfully', null);
  });
}
