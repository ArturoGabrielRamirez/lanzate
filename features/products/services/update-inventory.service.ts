import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { updateInventoryData } from '@/features/products/data/update-inventory.data';
import type { UpdateInventoryInput } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

/**
 * Business logic for inventory updates
 * - Validates variant and branch exist
 * - Checks store ownership
 * - Updates or creates inventory record
 */
export async function updateInventoryService(
  input: UpdateInventoryInput,
  userId: string
) {
  // Verify variant exists and belongs to a product in the user's store
  const variant = await prisma.productVariant.findUnique({
    where: { id: input.variantId },
    include: {
      product: {
        include: {
          store: true,
        },
      },
    },
  });

  if (!variant) {
    throw new Error('Variante no encontrada');
  }

  if (variant.product.store.ownerId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.UNAUTHORIZED.es);
  }

  // Verify branch exists and belongs to the user's store
  const branch = await prisma.branch.findUnique({
    where: { id: input.branchId },
    include: {
      store: true,
    },
  });

  if (!branch) {
    throw new Error('Sucursal no encontrada');
  }

  if (branch.store.ownerId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.UNAUTHORIZED.es);
  }

  // Update or create inventory record
  return await updateInventoryData(input);
}
