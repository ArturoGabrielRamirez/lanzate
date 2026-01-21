'use server';

import { revalidatePath } from 'next/cache';

import { getUserBySupabaseId } from '@/features/auth/data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import {
  productBasicInfoSchema,
  productMediaSchema,
  productVariantSchema,
} from '@/features/products/schemas';
import { createProductService } from '@/features/products/services';
import type {
  CreateFullProductInput,
  ProductWithAllRelations,
} from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

/**
 * Create Product Server Action
 *
 * Creates a new product with all related data (variants, images, attributes, etc.)
 *
 * Flow:
 * 1. Authenticate user
 * 2. Validate input data with Yup schemas
 * 3. Call createProductService (enforces attribute limits per subscription tier)
 * 4. Revalidate paths
 * 5. Return created product
 *
 * @param input - Full product creation input
 * @returns ServerResponse with created product or error
 */
export async function createProductAction(input: CreateFullProductInput) {
  return actionWrapper<ProductWithAllRelations>(async () => {
    // Create Supabase client
    const supabase = await createClient();

    // Get current authenticated user
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

    // Fetch database user to get user ID
    const dbUser = await getUserBySupabaseId(authUser.id);

    // Validate basic info
    await productBasicInfoSchema.validate(input.basicInfo, { abortEarly: false });

    // Validate media if provided
    if (input.images && input.images.length > 0) {
      await productMediaSchema.validate({ images: input.images }, { abortEarly: false });
    }

    // Validate variants if provided
    if (input.variants && input.variants.length > 0) {
      for (const variant of input.variants) {
        await productVariantSchema.validate(variant, { abortEarly: false });
      }
    }

    // Create product via service layer
    const product = await createProductService(input, dbUser.id);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess('Producto creado exitosamente', product);
  });
}
