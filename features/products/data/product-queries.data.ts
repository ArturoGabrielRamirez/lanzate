import { prisma } from '@/lib/prisma';

/**
 * Get Order Item with Order Data
 * 
 * Used for validating that a user has purchased a product before allowing a review.
 */
export async function getOrderItemWithOrderData(orderItemId: string) {
    return await prisma.orderItem.findUnique({
        where: { id: orderItemId },
        include: {
            order: true,
            product: true,
            variant: true,
        },
    });
}

/**
 * Check Product Ownership by Store
 */
export async function checkProductOwnershipData(productId: string, storeId: string) {
    return await prisma.product.findFirst({
        where: {
            id: productId,
            storeId,
        },
        select: { id: true },
    });
}

/**
 * Bulk Status Update Data
 */
export async function bulkUpdateProductStatusData(
    productIds: string[],
    storeId: string,
    status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED'
) {
    return await prisma.product.updateMany({
        where: {
            id: { in: productIds },
            storeId,
        },
        data: { status },
    });
}

/**
 * Bulk Delete Products Data
 */
export async function bulkDeleteProductsData(productIds: string[], storeId: string) {
    return await prisma.product.deleteMany({
        where: {
            id: { in: productIds },
            storeId,
        },
    });
}
