/**
 * Storefront Product Grid Component
 *
 * Responsive grid layout for product cards in the public storefront.
 * Server Component — no interactivity.
 */

import { StorefrontProductCard } from '@/features/storefront/components/storefront-product-card';
import type { StorefrontProductGridProps } from '@/features/storefront/types/storefront.types';

export function StorefrontProductGrid({
    products,
    storeSubdomain,
    emptyMessage = 'No hay productos disponibles en este momento.',
}: StorefrontProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-base text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
                <StorefrontProductCard
                    key={product.id}
                    product={product}
                    storeSubdomain={storeSubdomain}
                />
            ))}
        </div>
    );
}
