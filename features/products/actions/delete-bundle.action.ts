'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { deleteBundleSchema } from '@/features/products/schemas';
import { deleteBundleService } from '@/features/products/services/delete-bundle.service';
import { createClient } from '@/lib/supabase/server';


import type { ProductBundle } from '@prisma/client';

/**
 * Server action to delete bundle
 * - Authenticate user
 * - Validate bundle ID
 * - Call deleteBundleService
 * - Revalidate bundle pages
 */
export async function deleteBundleAction(bundleId: string) {
  return actionWrapper<ProductBundle>(async () => {
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
    await deleteBundleSchema.validate({ id: bundleId }, { abortEarly: false });

    // Call service layer
    const result = await deleteBundleService(bundleId, authUser.id);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/bundles');

    return formatSuccess('Paquete eliminado exitosamente', result);
  });
}
