import type { UpdateFullProductInput, ProductWithAllRelations } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

/**
 * Update Full Product Data Function
 * 
 * Updates a product and all its related data (variants, attributes, images, digital info)
 * within a single database transaction. 
 */
export async function updateFullProductData(
    productId: string,
    input: UpdateFullProductInput
): Promise<ProductWithAllRelations> {
    await prisma.$transaction(async (tx) => {
        // 1. Update basic info if provided
        if (input.basicInfo) {
            await tx.product.update({
                where: { id: productId },
                data: {
                    ...(input.basicInfo.name && { name: input.basicInfo.name }),
                    ...(input.basicInfo.description !== undefined && { description: input.basicInfo.description }),
                    ...(input.basicInfo.slug && { slug: input.basicInfo.slug }),
                    ...(input.basicInfo.brand !== undefined && { brand: input.basicInfo.brand }),
                    ...(input.basicInfo.status && { status: input.basicInfo.status }),
                    ...(input.basicInfo.isDigital !== undefined && { isDigital: input.basicInfo.isDigital }),
                    ...(input.basicInfo.isFeatured !== undefined && { isFeatured: input.basicInfo.isFeatured }),
                    ...(input.basicInfo.isNew !== undefined && { isNew: input.basicInfo.isNew }),
                    ...(input.basicInfo.isOnSale !== undefined && { isOnSale: input.basicInfo.isOnSale }),
                    ...(input.basicInfo.allowPromotions !== undefined && { allowPromotions: input.basicInfo.allowPromotions }),
                    ...(input.basicInfo.trackInventory !== undefined && { trackInventory: input.basicInfo.trackInventory }),
                    ...(input.basicInfo.seoTitle !== undefined && { seoTitle: input.basicInfo.seoTitle }),
                    ...(input.basicInfo.seoDescription !== undefined && { seoDescription: input.basicInfo.seoDescription }),
                    ...(input.basicInfo.urlSlug !== undefined && { urlSlug: input.basicInfo.urlSlug }),
                    ...(input.basicInfo.ogImageUrl !== undefined && { ogImageUrl: input.basicInfo.ogImageUrl }),
                },
            });
        }

        // 2. Replace attributes if provided (delete existing, create new)
        if (input.attributes) {
            // Delete existing attributes (cascades to values via Prisma)
            await tx.productAttribute.deleteMany({
                where: { productId },
            });

            // Create new attributes
            for (const attr of input.attributes) {
                await tx.productAttribute.create({
                    data: {
                        name: attr.name,
                        type: attr.type,
                        productId,
                        values: {
                            create: attr.values.map((value) => ({ value })),
                        },
                    },
                });
            }
        }

        // 3. Replace variants if provided
        if (input.variants) {
            // Delete existing variants (cascades to inventory and attribute values)
            await tx.productVariant.deleteMany({
                where: { productId },
            });

            // Create new variants
            for (const variant of input.variants) {
                const createdVariant = await tx.productVariant.create({
                    data: {
                        sku: variant.sku,
                        price: variant.price,
                        promotionalPrice: variant.promotionalPrice,
                        cost: variant.cost,
                        productId,
                    },
                });

                // Link variant to attribute values
                if (variant.attributeValueIds && variant.attributeValueIds.length > 0) {
                    await tx.variantAttributeValue.createMany({
                        data: variant.attributeValueIds.map((attributeValueId) => ({
                            variantId: createdVariant.id,
                            attributeValueId,
                        })),
                    });
                }

                // Create inventory entries
                if (input.inventory) {
                    const variantInventory = input.inventory.filter(
                        (inv) => inv.variantSku === variant.sku
                    );
                    for (const inv of variantInventory) {
                        await tx.variantInventory.create({
                            data: {
                                variantId: createdVariant.id,
                                branchId: inv.branchId,
                                quantity: inv.quantity,
                                lowStockThreshold: inv.lowStockThreshold ?? 10,
                            },
                        });
                    }
                }
            }
        }

        // 4. Replace images if provided
        if (input.images) {
            await tx.productImage.deleteMany({
                where: { productId },
            });

            await tx.productImage.createMany({
                data: input.images.map((img) => ({
                    productId,
                    url: img.url,
                    altText: img.altText,
                    position: img.position,
                    isPrimary: img.isPrimary,
                })),
            });
        }

        // 5. Update digital product data if provided
        if (input.digitalProduct) {
            await tx.digitalProduct.upsert({
                where: { productId },
                update: {
                    downloadUrl: input.digitalProduct.downloadUrl,
                    fileName: input.digitalProduct.fileName,
                    fileType: input.digitalProduct.fileType,
                    fileSize: input.digitalProduct.fileSize,
                    expirationDate: input.digitalProduct.expirationDate,
                    downloadLimit: input.digitalProduct.downloadLimit,
                },
                create: {
                    productId,
                    downloadUrl: input.digitalProduct.downloadUrl,
                    fileName: input.digitalProduct.fileName,
                    fileType: input.digitalProduct.fileType,
                    fileSize: input.digitalProduct.fileSize,
                    expirationDate: input.digitalProduct.expirationDate,
                    downloadLimit: input.digitalProduct.downloadLimit,
                    downloadCount: 0,
                },
            });
        }
    });

    // Fetch and return the complete updated product
    const completeProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            variants: {
                orderBy: { createdAt: 'asc' },
            },
            images: {
                orderBy: { position: 'asc' },
            },
            digitalProduct: true,
            attributes: {
                include: {
                    values: true,
                },
            },
            _count: {
                select: {
                    variants: true,
                    images: true,
                    reviews: true,
                },
            },
        },
    });

    return completeProduct as ProductWithAllRelations;
}
