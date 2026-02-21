import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import { getDigitalProductData } from '@/features/products/data/get-digital-product.data';
import { incrementDownloadCountData } from '@/features/products/data/increment-download-count.data';
import type { DownloadUrlResponse } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

/**
 * Business logic for download URL generation
 * - Validates user owns the order with this product
 * - Checks expiration date
 * - Checks download limit
 * - Increments download count
 * - Returns download URL
 */
export async function getDownloadUrlService(
  productId: string,
  orderItemId: string,
  userId: string
): Promise<DownloadUrlResponse> {
  // Get digital product
  const digitalProduct = await getDigitalProductData(productId);

  if (!digitalProduct) {
    throw new Error('Producto digital no encontrado');
  }

  // Verify user owns an order containing this product via orderItemId
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: {
      order: true,
      product: true,
      variant: true,
    },
  });

  if (!orderItem) {
    throw new Error('Artículo de pedido no encontrado');
  }

  if (orderItem.order.userId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Verify the order item contains this product
  if (orderItem.productId !== productId) {
    throw new Error('El artículo de pedido no corresponde al producto');
  }

  // Check expiration date
  if (digitalProduct.expirationDate && digitalProduct.expirationDate < new Date()) {
    throw new Error(PRODUCT_ERROR_MESSAGES.DOWNLOAD_EXPIRED);
  }

  // Check download limit
  if (
    digitalProduct.downloadLimit !== null &&
    digitalProduct.downloadCount >= digitalProduct.downloadLimit
  ) {
    throw new Error(PRODUCT_ERROR_MESSAGES.DOWNLOAD_LIMIT_REACHED);
  }

  // Increment download count
  await incrementDownloadCountData(digitalProduct.id);

  // Calculate downloads remaining
  const downloadsRemaining =
    digitalProduct.downloadLimit !== null
      ? digitalProduct.downloadLimit - digitalProduct.downloadCount - 1
      : undefined;

  return {
    downloadUrl: digitalProduct.downloadUrl,
    fileName: digitalProduct.fileName,
    fileSize: digitalProduct.fileSize,
    downloadsRemaining,
  };
}
