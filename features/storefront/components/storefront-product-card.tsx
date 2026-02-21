/**
 * Storefront Product Card Component
 *
 * Displays a single product in the public storefront grid.
 * Uses BaseCard with layout="column" from @/features/global.
 *
 * Architecture:
 * - Server Component (no interactivity, no "use client")
 * - Uses Next.js Image for optimized images
 * - Derives "starting at" price from the lowest variant price
 */

import Image from 'next/image';

import {
    BaseCard,
    /* BaseCardContent, */
    BaseCardHeader,
} from '@/features/global/components/base-card/base-card';
import { STOREFRONT_MESSAGES } from '@/features/storefront/constants/messages';
import type { StorefrontProductCardProps } from '@/features/storefront/types/storefront.types';
import { Link } from '@/i18n/navigation';

export function StorefrontProductCard({
    product,
    /* storeSubdomain, */
}: StorefrontProductCardProps) {
    // Resolve the display image (prefer primary, fallback to first)
    const displayImage =
        product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

    // Calculate "starting at" price from lowest variant price
    const prices = product.variants?.map((v) => Number(v.price)).filter(Boolean) ?? [];
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;

    // Check if any variant has an active promotional price
    const hasPromo = product.variants?.some(
        (v) => v.promotionalPrice && Number(v.promotionalPrice) < Number(v.price)
    );

    const priceText =
        lowestPrice !== null
            ? `${STOREFRONT_MESSAGES.PRODUCT.STARTING_AT} $${lowestPrice.toFixed(2)}`
            : STOREFRONT_MESSAGES.PRODUCT.NO_PRICE;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            style={{ borderRadius: 'var(--sf-radius)' }}
        >
            <BaseCard
                layout="column"
                hover="default"
                size="sm"
                className="h-full overflow-hidden transition-shadow"
                style={{ borderRadius: 'var(--sf-radius)' } as React.CSSProperties}
            >
                {/* Product image */}
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    {displayImage ? (
                        <Image
                            src={displayImage.url}
                            alt={displayImage.altText ?? product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <span className="text-4xl font-bold text-muted-foreground/30">
                                {product.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Badges overlay */}
                    {(product.isNew || product.isOnSale) && (
                        <div className="absolute left-2 top-2 flex flex-col gap-1">
                            {product.isNew && (
                                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    {STOREFRONT_MESSAGES.PRODUCT.NEW_BADGE}
                                </span>
                            )}
                            {product.isOnSale && (
                                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                                    {STOREFRONT_MESSAGES.PRODUCT.SALE_BADGE}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Card content: name + price */}
                <BaseCardHeader
                    title={
                        <span className="line-clamp-2 text-sm font-medium leading-snug">
                            {product.name}
                        </span>
                    }
                    description={
                        <span
                            className="text-sm font-semibold"
                            style={{
                                color: hasPromo ? '#ef4444' : 'var(--sf-primary)',
                            }}
                        >
                            {priceText}
                        </span>
                    }
                />
            </BaseCard>
        </Link>
    );
}
