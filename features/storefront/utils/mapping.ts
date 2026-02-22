import type { StorefrontProduct } from "@/features/storefront/types/storefront.types";
import type { ProductWithRelations } from "@/features/stores/types";

/**
 * Maps a full product object (as returned by the data layer/Prisma)
 * to the minimal StorefrontProduct interface used by storefront components.
 */
export function mapProductToStorefront(product: ProductWithRelations): StorefrontProduct {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        isNew: product.isNew,
        isOnSale: product.isOnSale,
        isFeatured: product.isFeatured,
        images: product.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
        })),
        variants: product.variants.map((v) => ({
            price: v.price.toString(),
            promotionalPrice: v.promotionalPrice?.toString() ?? null,
        })),
    };
}

/**
 * Maps multiple products to storefront products.
 */
export function mapProductsToStorefront(products: ProductWithRelations[]): StorefrontProduct[] {
    return products.map(mapProductToStorefront);
}
