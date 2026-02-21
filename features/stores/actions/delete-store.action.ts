'use server';

import { revalidatePath } from 'next/cache';

import { getUserBySupabaseId } from '@/features/auth/data';
import { getAuthUser } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { STORE_ERROR_MESSAGES, STORE_SUCCESS_MESSAGES } from '@/features/stores/constants';
import { deleteStoreService } from '@/features/stores/services/delete-store.service';

/**
 * Delete Store Server Action
 *
 * Deletes a store by ID, verifying the authenticated user is the owner.
 * Revalidates dashboard and stores pages after successful deletion.
 *
 * Flow:
 * 1. Validate storeId is provided
 * 2. Get authenticated user via getAuthUser
 * 3. Fetch database user record by Supabase ID
 * 4. Delete store via deleteStoreService (handles ownership verification)
 * 5. Revalidate affected pages
 * 6. Return success response
 *
 * @param storeId - The ID of the store to delete
 * @returns ServerResponse with success or error message
 *
 * @example
 * ```tsx
 * const result = await deleteStoreAction(storeId);
 * if (!result.hasError) {
 *   // Store deleted, redirect to dashboard
 *   redirect('/dashboard');
 * }
 * ```
 */
export async function deleteStoreAction(storeId: string) {
  return actionWrapper<null>(async () => {
    if (!storeId || storeId.trim() === '') {
      throw new Error(STORE_ERROR_MESSAGES.STORE_ID_REQUIRED);
    }

    const authUser = await getAuthUser();

    if (!authUser) {
      throw new Error(STORE_ERROR_MESSAGES.NOT_AUTHENTICATED);
    }

    const dbUser = await getUserBySupabaseId(authUser.id);

    await deleteStoreService(storeId, dbUser.id);

    revalidatePath('/[locale]/dashboard', 'page');
    revalidatePath('/[locale]/stores', 'page');

    return formatSuccess(STORE_SUCCESS_MESSAGES.DELETED, null);
  });
}
