'use server';

import { requireAuth } from '@/features/auth/utils';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { PRODUCT_ERROR_MESSAGES, PRODUCT_SUCCESS_MESSAGES } from '@/features/products/constants';
import { getDownloadUrlSchema } from '@/features/products/schemas';
import { getDownloadUrlService } from '@/features/products/services/get-download-url.service';
import type { GetDownloadUrlInput, DownloadUrlResponse } from '@/features/products/types/product.types';

/**
 * Get Download URL Server Action
 *
 * Generates a secure download URL for a digital product purchase.
 * Validates purchase ownership, expiration, and download limits.
 *
 * Flow:
 * 1. Authenticate user via Supabase
 * 2. Validate input with getDownloadUrlSchema
 * 3. Call getDownloadUrlService to validate ownership and generate URL
 * 4. Return secure download URL with file metadata
 *
 * @param input - Download URL input (productId, orderItemId)
 * @returns ServerResponse with download URL and file metadata
 *
 * @example
 * ```tsx
 * const result = await getDownloadUrlAction({
 *   productId: 'prod-1',
 *   orderItemId: 'item-1'
 * });
 * if (!result.hasError && result.payload) {
 *   window.location.href = result.payload.downloadUrl;
 * }
 * ```
 */
export async function getDownloadUrlAction(input: GetDownloadUrlInput) {
  return actionWrapper<DownloadUrlResponse>(async () => {
    const { authUser } = await requireAuth(PRODUCT_ERROR_MESSAGES.NOT_AUTHENTICATED);

    await getDownloadUrlSchema.validate(input, { abortEarly: false });

    const result = await getDownloadUrlService(
      input.productId,
      input.orderItemId,
      authUser.id
    );

    return formatSuccess(PRODUCT_SUCCESS_MESSAGES.DOWNLOAD_URL_FETCHED, result);
  });
}
