import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants';
import { updateBundleData } from '@/features/products/data';
import type { UpdateBundleInput } from '@/features/products/types';
import { prisma } from '@/lib/prisma';

/**
 * Business logic for bundle updates
 * - Validates bundle ownership
 * - Validates product/variant references
 * - Updates bundle and replaces items
 */
export async function updateBundleService(
  input: UpdateBundleInput,
  userId: string
) {
  // Verify bundle exists and belongs to user's store
  const bundle = await prisma.productBundle.findUnique({
    where: { id: input.id },
    include: {
      store: true,
    },
  });

  if (!bundle) {
    throw new Error('Paquete no encontrado');
  }

  if (bundle.store.ownerId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Validate all products exist and belong to the store
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      storeId: bundle.storeId,
    },
    include: {
      variants: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new Error('Uno o más productos no existen o no pertenecen a tu tienda');
  }

  // Validate variants (if specified) belong to their products
  for (const item of input.items) {
    if (item.variantId) {
      const product = products.find((p) => p.id === item.productId);
      const variantExists = product?.variants.some((v) => v.id === item.variantId);

      if (!variantExists) {
        throw new Error(
          `La variante ${item.variantId} no pertenece al producto ${item.productId}`
        );
      }
    }
  }

  // Update bundle
  return await updateBundleData(input);
}
