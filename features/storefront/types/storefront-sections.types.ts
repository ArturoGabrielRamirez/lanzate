/**
 * Storefront Page Sections — Types
 *
 * Defines the type system for configurable storefront page sections.
 * Each section has a type, enabled flag, order, and type-specific settings.
 *
 * The default config is static for now. When per-store persistence is
 * added (StoreAppearance table), only the data layer changes — these
 * types and section components stay the same.
 */

export type SectionType =
    | 'hero'
    | 'featured-products'
    | 'all-products'
    | 'banner'
    | 'text-block';

export interface HeroSettings {
    /** Custom title; falls back to store.name */
    title?: string;
    /** Custom subtitle; falls back to store.description */
    subtitle?: string;
    /** CTA button label */
    ctaLabel?: string;
    /** Whether to show the store cover image as background */
    showCoverImage: boolean;
}

export interface FeaturedProductsSettings {
    /** Section heading */
    title?: string;
    /** Maximum number of products to display */
    maxItems: number;
}

export interface AllProductsSettings {
    /** Section heading */
    title?: string;
}

export interface BannerSettings {
    imageUrl?: string;
    altText?: string;
    /** Optional link when banner is clicked */
    linkUrl?: string;
}

export interface TextBlockSettings {
    content: string;
    alignment: 'left' | 'center' | 'right';
}

export type SectionSettings = {
    hero: HeroSettings;
    'featured-products': FeaturedProductsSettings;
    'all-products': AllProductsSettings;
    banner: BannerSettings;
    'text-block': TextBlockSettings;
};

export interface PageSection<T extends SectionType = SectionType> {
    id: string;
    type: T;
    enabled: boolean;
    order: number;
    settings: SectionSettings[T];
}

/** Union of all possible section shapes (discriminated by type) */
export type AnyPageSection = {
    [T in SectionType]: PageSection<T>;
}[SectionType];

// ---------------------------------------------------------------------------
// Default section configuration (static until DB persistence is added)
// ---------------------------------------------------------------------------

export const DEFAULT_HOME_SECTIONS: AnyPageSection[] = [
    {
        id: 'hero',
        type: 'hero',
        enabled: true,
        order: 0,
        settings: {
            showCoverImage: false,
        },
    },
    {
        id: 'featured-products',
        type: 'featured-products',
        enabled: true,
        order: 1,
        settings: {
            maxItems: 8,
        },
    },
];
