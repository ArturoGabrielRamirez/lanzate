import { PRODUCT_ERROR_MESSAGES } from '@/features/products/constants/messages';
import {
  getDigitalProductData,
  incrementDownloadCountData,
  getOrderItemWithOrderData,
} from '@/features/products/data';
import type { DownloadUrlResponse } from '@/features/products/types/product.types';

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
  // Get digital product via data layer
  const digitalProduct = await getDigitalProductData(productId);

  if (!digitalProduct) {
    throw new Error(PRODUCT_ERROR_MESSAGES.DIGITAL_PRODUCT_NOT_FOUND);
  }

  // Verify user owns an order containing this product via orderItemId (data layer)
  const orderItem = await getOrderItemWithOrderData(orderItemId);

  if (!orderItem) {
    throw new Error(PRODUCT_ERROR_MESSAGES.ORDER_ITEM_NOT_FOUND);
  }

  if (orderItem.order.userId !== userId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.UNAUTHORIZED);
  }

  // Verify the order item contains this product
  if (orderItem.productId !== productId) {
    throw new Error(PRODUCT_ERROR_MESSAGES.ORDER_ITEM_MISMATCH);
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

  // Increment download count via data layer
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
