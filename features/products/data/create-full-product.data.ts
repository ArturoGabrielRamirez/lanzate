import type { CreateFullProductInput, ProductWithAllRelations } from '@/features/products/types/product.types';
import { prisma } from '@/lib/prisma';

/**
 * Create Full Product Data Function
 * 
 * Creates a product with all its related data (variants, attributes, images, digital info)
 * within a single database transaction. 
 */
export async function createFullProductData(
    input: CreateFullProductInput
): Promise<ProductWithAllRelations> {
    const product = await prisma.$transaction(async (tx) => {
        // 1. Create the base product
        const createdProduct = await tx.product.create({
            data: {
                name: input.basicInfo.name,
                description: input.basicInfo.description,
                slug: input.basicInfo.slug,
                brand: input.basicInfo.brand,
                status: input.basicInfo.status ?? 'DRAFT',
                isDigital: input.basicInfo.isDigital ?? false,
                isFeatured: input.basicInfo.isFeatured ?? false,
                isNew: input.basicInfo.isNew ?? false,
                isOnSale: input.basicInfo.isOnSale ?? false,
                allowPromotions: input.basicInfo.allowPromotions ?? true,
                trackInventory: input.basicInfo.trackInventory ?? true,
                seoTitle: input.basicInfo.seoTitle,
                seoDescription: input.basicInfo.seoDescription,
                urlSlug: input.basicInfo.urlSlug,
                ogImageUrl: input.basicInfo.ogImageUrl,
                storeId: input.storeId,
            },
        });

        // 2. Create attributes and their values
        if (input.attributes && input.attributes.length > 0) {
            for (const attr of input.attributes) {
                await tx.productAttribute.create({
                    data: {
                        name: attr.name,
                        type: attr.type,
                        productId: createdProduct.id,
                        values: {
                            create: attr.values.map((value) => ({ value })),
                        },
                    },
                });
            }
        }

        // 3. Create variants
        if (input.variants && input.variants.length > 0) {
            for (const variant of input.variants) {
                const createdVariant = await tx.productVariant.create({
                    data: {
                        sku: variant.sku,
                        price: variant.price,
                        promotionalPrice: variant.promotionalPrice,
                        cost: variant.cost,
                        productId: createdProduct.id,
                    },
                });

                // Link variant to attribute values if provided
                if (variant.attributeValueIds && variant.attributeValueIds.length > 0) {
                    await tx.variantAttributeValue.createMany({
                        data: variant.attributeValueIds.map((attributeValueId) => ({
                            variantId: createdVariant.id,
                            attributeValueId,
                        })),
                    });
                }

                // Create inventory entries for this variant
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

        // 4. Create images
        if (input.images && input.images.length > 0) {
            await tx.productImage.createMany({
                data: input.images.map((img) => ({
                    productId: createdProduct.id,
                    url: img.url,
                    altText: img.altText,
                    position: img.position,
                    isPrimary: img.isPrimary,
                })),
            });
        }

        // 5. Create digital product data if applicable
        if (input.basicInfo.isDigital && input.digitalProduct) {
            await tx.digitalProduct.create({
                data: {
                    productId: createdProduct.id,
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

        return createdProduct;
    });

    // Fetch and return the complete product with all relations
    const completeProduct = await prisma.product.findUnique({
        where: { id: product.id },
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
