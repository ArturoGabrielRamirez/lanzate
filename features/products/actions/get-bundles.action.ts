'use server';

import { getUserStoreData } from '@/features/global/data/get-user-store.data';
import { actionWrapper } from '@/features/global/utils/action-wrapper';
import { formatSuccess } from '@/features/global/utils/format-response';
import { getBundlesData } from '@/features/products/data/get-bundles.data';
import { createClient } from '@/lib/supabase/server';

import type { ProductBundle } from '@prisma/client';

/**
 * Server action to get bundles
 * - Authenticate user
 * - Get user's store
 * - Return all bundles for store
 */
export async function getBundlesAction() {
  return actionWrapper<ProductBundle[]>(async () => {
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

    // Get user's store
    const store = await getUserStoreData(authUser.id);

    if (!store) {
      throw new Error('Tienda no encontrada');
    }

    const bundles = await getBundlesData(store.id);

    return formatSuccess('Paquetes obtenidos exitosamente', bundles);
  });
}
