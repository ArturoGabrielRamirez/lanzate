/**
 * Storefront Featured Products Section
 *
 * Displays a grid of featured (isFeatured=true) active products.
 * Fetches its own data — works as an async Server Component.
 */

import { getProductsAction } from '@/features/products/actions';
import { StorefrontProductGrid } from '@/features/storefront/components/storefront-product-grid';
import type { FeaturedProductsSettings } from '@/features/storefront/types/storefront-sections.types';
import { Link } from '@/i18n/navigation';

interface FeaturedProductsSectionProps {
    storeId: string;
    storeSubdomain: string;
    settings: FeaturedProductsSettings;
}

export async function FeaturedProductsSection({
    storeId,
    storeSubdomain,
    settings,
}: FeaturedProductsSectionProps) {
    const title = settings.title;
    const maxItems = settings.maxItems;

    const productsResult = await getProductsAction({
        storeId,
        status: 'ACTIVE',
        isFeatured: true,
        pageSize: maxItems,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1,
    });

    const products = productsResult.payload?.data ?? [];
    const heading = title ?? (products.length > 0 ? 'Productos destacados' : 'Últimos productos');

    return (
        <section className="container mx-auto px-4 py-12">
            <h2
                className="mb-6 text-2xl font-bold"
                style={{ color: 'var(--sf-text)' }}
            >
                {heading}
            </h2>
            <StorefrontProductGrid
                products={products.map((p) => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    isNew: p.isNew,
                    isOnSale: p.isOnSale,
                    isFeatured: p.isFeatured,
                    images: p.images.map((img) => ({
                        url: img.url,
                        altText: img.altText,
                        isPrimary: img.isPrimary,
                    })),
                    variants: p.variants.map((v) => ({
                        price: v.price.toString(),
                        promotionalPrice: v.promotionalPrice?.toString() ?? null,
                    })),
                }))}
                storeSubdomain={storeSubdomain}
                emptyMessage="Próximamente habrá productos disponibles."
            />
            {products.length > 0 && (
                <div className="mt-8 text-center">
                    <Link
                        href="/products"
                        className="text-sm font-medium underline underline-offset-4"
                        style={{ color: 'var(--sf-primary)' }}
                    >
                        Ver catálogo completo →
                    </Link>
                </div>
            )}
        </section>
    );
}
