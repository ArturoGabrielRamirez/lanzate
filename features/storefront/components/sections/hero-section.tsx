/**
 * Storefront Hero Section
 *
 * Full-width hero banner for the storefront home page.
 * Settings can be customized per-store; falls back to store data.
 */


import type { HeroSettings } from '@/features/storefront/types/storefront-sections.types';
import { Link } from '@/i18n/navigation';

import type { Store } from '@prisma/client';

interface HeroSectionProps {
    store: Store;
    settings: HeroSettings;
}

export function HeroSection({ store, settings }: HeroSectionProps) {
    const title = settings.title ?? `Bienvenido a ${store.name}`;
    const subtitle = settings.subtitle ?? store.description;
    const ctaLabel = settings.ctaLabel ?? 'Ver todos los productos';

    return (
        <section
            className="py-16"
            style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--sf-primary) 10%, transparent), color-mix(in srgb, var(--sf-primary) 4%, transparent))`,
            }}
        >
            <div className="container mx-auto px-4 text-center">
                <h1
                    className="text-4xl font-bold tracking-tight md:text-5xl"
                    style={{ color: 'var(--sf-text)' }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p
                        className="mx-auto mt-4 max-w-xl text-lg"
                        style={{ color: 'color-mix(in srgb, var(--sf-text) 70%, transparent)' }}
                    >
                        {subtitle}
                    </p>
                )}
                <Link
                    href="/products"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
                    style={{
                        backgroundColor: 'var(--sf-primary)',
                        borderRadius: 'var(--sf-radius)',
                    }}
                >
                    {ctaLabel}
                </Link>
            </div>
        </section>
    );
}
