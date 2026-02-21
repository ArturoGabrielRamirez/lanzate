import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to increment download count
 * @param digitalProductId - Digital product ID
 * @returns Updated DigitalProduct
 */
export async function incrementDownloadCountData(digitalProductId: string) {
  return await prisma.digitalProduct.update({
    where: { id: digitalProductId },
    data: {
      downloadCount: {
        increment: 1,
      },
    },
  });
}
