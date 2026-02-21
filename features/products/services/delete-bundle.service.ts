import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { deleteBundleData } from '@/features/products/data/delete-bundle.data';
import { prisma } from '@/lib/prisma';

/**
 * Business logic for bundle deletion
 * - Validates bundle ownership
 * - Deletes bundle
 */
export async function deleteBundleService(bundleId: string, userId: string) {
  // Verify bundle exists and belongs to user's store
  const bundle = await prisma.productBundle.findUnique({
    where: { id: bundleId },
    include: {
      store: true,
    },
  });

  if (!bundle) {
    throw new Error('Paquete no encontrado');
  }

  if (bundle.store.ownerId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.UNAUTHORIZED.es);
  }

  // Delete bundle (cascade deletes items)
  return await deleteBundleData(bundleId);
}
