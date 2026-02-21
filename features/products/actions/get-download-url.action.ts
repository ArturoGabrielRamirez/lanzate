'use server';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getDownloadUrlSchema } from '@/features/products/schemas';
import { getDownloadUrlService } from '@/features/products/services/get-download-url.service';
import type { GetDownloadUrlInput, DownloadUrlResponse } from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

/**
 * Server action to get download URL
 * - Authenticate user
 * - Validate purchase ownership
 * - Check expiration and limits
 * - Return secure download URL
 */
export async function getDownloadUrlAction(input: GetDownloadUrlInput) {
  return actionWrapper<DownloadUrlResponse>(async () => {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!authUser) {
      throw new Error('Usuario no autenticado');
    }

    // Validate input manually with schema
    await getDownloadUrlSchema.validate(input, { abortEarly: false });

    // Call service layer
    const result = await getDownloadUrlService(
      input.productId,
      input.orderItemId,
      authUser.id
    );

    return formatSuccess('URL de descarga generada exitosamente', result);
  });
}
