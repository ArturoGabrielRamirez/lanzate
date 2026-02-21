import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to get digital product
 * @param productId - Product ID
 * @returns DigitalProduct or null
 */
export async function getDigitalProductData(productId: string) {
  return await prisma.digitalProduct.findUnique({
    where: { productId },
    include: {
      product: true,
    },
  });
}
