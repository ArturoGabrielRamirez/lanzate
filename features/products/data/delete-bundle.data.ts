import { prisma } from '@/lib/prisma';

/**
 * Pure Prisma query to delete bundle
 * @param bundleId - Bundle ID
 * @returns Deleted bundle
 */
export async function deleteBundleData(bundleId: string) {
  return await prisma.productBundle.delete({
    where: { id: bundleId },
  });
}
