'use server';

import { revalidatePath } from 'next/cache';

import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { inventoryUpdateSchema, type InventoryUpdateInput } from '@/features/products/schemas';
import { updateInventoryService } from '@/features/products/services/update-inventory.service';
import { createClient } from '@/lib/supabase/server';

import type { VariantInventory } from '@prisma/client';

/**
 * Server action to update inventory
 * - Authenticate user
 * - Validate with inventoryUpdateSchema
 * - Call updateInventoryService
 * - Revalidate product pages
 */
export async function updateInventoryAction(input: InventoryUpdateInput) {
  return actionWrapper<VariantInventory>(async () => {
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
    await inventoryUpdateSchema.validate(input, { abortEarly: false });

    // Call service layer
    const result = await updateInventoryService(input, authUser.id);

    // Revalidate paths
    revalidatePath('/[locale]/dashboard/[storeSlug]/products');

    return formatSuccess('Inventario actualizado exitosamente', result);
  });
}
