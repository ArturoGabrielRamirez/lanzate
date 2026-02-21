/**
 * Storefront Section Renderer
 *
 * Iterates over an ordered list of PageSection configs and renders
 * the matching section component for each enabled section.
 *
 * Adding a new section type only requires:
 * 1. Defining its settings in storefront-sections.types.ts
 * 2. Creating a new section component
 * 3. Adding a case here
 */



import { FeaturedProductsSection } from '@/features/storefront/components/sections/featured-products-section';
import { HeroSection } from '@/features/storefront/components/sections/hero-section';
import type { AnyPageSection } from '@/features/storefront/types/storefront-sections.types';

import type { Store } from '@prisma/client';

interface SectionRendererProps {
    sections: AnyPageSection[];
    store: Store;
    storeSubdomain: string;
}

export function SectionRenderer({ sections, store, storeSubdomain }: SectionRendererProps) {
    const enabled = [...sections]
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <>
            {enabled.map((section) => {
                switch (section.type) {
                    case 'hero':
                        return (
                            <HeroSection
                                key={section.id}
                                store={store}
                                settings={section.settings}
                            />
                        );
                    case 'featured-products':
                        return (
                            <FeaturedProductsSection
                                key={section.id}
                                storeId={store.id}
                                storeSubdomain={storeSubdomain}
                                settings={section.settings}
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
