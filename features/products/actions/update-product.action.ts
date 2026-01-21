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
import { updateProductService } from '@/features/products/services';
import type {
  UpdateFullProductInput,
  ProductWithAllRelations,
} from '@/features/products/types/product.types';
import { createClient } from '@/lib/supabase/server';

/**
 * Update Product Server Action
 *
 * Updates an existing product with all related data.
 *
 * Flow:
 * 1. Authenticate user
 * 2. Validate input data with Yup schemas
 * 3. Call updateProductService
 * 4. Revalidate paths
 * 5. Return updated product
 *
 * @param productId - The product ID to update
 * @param input - Product update input
 * @returns ServerResponse with updated product or error
 */
export async function updateProductAction(
  productId: string,
  input: UpdateFullProductInput
) {
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

    // Validate basic info if provided
    if (input.basicInfo) {
      // Use partial validation for updates
      const partialSchema = productBasicInfoSchema.partial();
      await partialSchema.validate(input.basicInfo, { abortEarly: false });
    }

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

    // Update product via service layer
    const product = await updateProductService(productId, input, dbUser.id);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/products');
    revalidatePath(`/[locale]/dashboard/[storeSlug]/products/${productId}`);

    return formatSuccess('Producto actualizado exitosamente', product);
  });
}
