'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { bundleSchema } from '@/features/products/schemas/product.schema';
import { createBundleService } from '@/features/products/services/create-bundle.service';
import type { CreateBundleInput } from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

import type { ProductBundle } from '@prisma/client';

/**
 * Server action to create bundle
 * - Authenticate user
 * - Validate with bundleSchema
 * - Call createBundleService
 * - Revalidate bundle pages
 */
export async function createBundleAction(input: CreateBundleInput) {
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
    await bundleSchema.validate(input, { abortEarly: false });

    // Call service layer
    const result = await createBundleService(input, authUser.id);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/bundles');

    return formatSuccess('Paquete creado exitosamente', result);
  });
}
