'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { updateBundleSchema } from '@/features/products/schemas';
import { updateBundleService } from '@/features/products/services';
import type { UpdateBundleInput } from '@/features/products/types';
import { createClient } from '@/lib/supabase/server';

import type { ProductBundle } from '@prisma/client';

/**
 * Server action to update bundle
 * - Authenticate user
 * - Validate with updateBundleSchema
 * - Call updateBundleService
 * - Revalidate bundle pages
 */
export async function updateBundleAction(input: UpdateBundleInput) {
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
    await updateBundleSchema.validate(input, { abortEarly: false });

    // Call service layer
    const result = await updateBundleService(input, authUser.id);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/bundles');

    return formatSuccess('Paquete actualizado exitosamente', result);
  });
}
