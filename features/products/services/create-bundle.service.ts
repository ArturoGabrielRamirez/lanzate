import { createBundleData } from '@/features/products/data/create-bundle.data';
import type { CreateBundleInput } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';


/**
 * Business logic for bundle creation
 * - Validates all products exist and belong to store
 * - Validates variants (if specified) belong to products
 * - Creates bundle with items
 */
export async function createBundleService(
  input: CreateBundleInput,
  userId: string
) {
  // Get user's store
  const store = await prisma.store.findFirst({
    where: { id: userId },
  });

  if (!store) {
    throw new Error('Tienda no encontrada');
  }

  // Validate all products exist and belong to the store
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      storeId: store.id,
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

  // Create bundle
  return await createBundleData({
    storeId: store.id,
    name: input.name,
    description: input.description,
    price: input.price,
    isActive: input.isActive,
    items: input.items,
  });
}
