/**
 * Storefront Header Component
 *
 * Public header for the store's subdomain page.
 * Displays store logo (if available) or text initials, store name,
 * and a "Productos" navigation link.
 *
 * Respects theme.headerLayout for alignment:
 * - 'left'     → logo + nav left-aligned (default)
 * - 'centered' → everything centered
 * - 'right'    → content right-aligned
 */

import Image from 'next/image';

import type { StorefrontHeaderProps } from '@/features/storefront/types/storefront.types';
import { Link } from '@/i18n/navigation';

export function StorefrontHeader({ store, theme }: StorefrontHeaderProps) {
    const alignClass =
        theme.headerLayout === 'centered'
            ? 'justify-center'
            : theme.headerLayout === 'right'
                ? 'justify-end'
                : 'justify-between';

    // Derive the initial letter shown when no logo is available
    const initial = store.name.charAt(0).toUpperCase();

    return (
        <header
            className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur"
            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)' }}
        >
            <div className={`container mx-auto flex items-center gap-4 px-4 py-4 ${alignClass}`}>
                {/* Brand */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 font-bold hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--sf-text)' }}
                >
                    {theme.showHeaderLogo && store.logoUrl ? (
                        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                            <Image
                                src={store.logoUrl}
                                alt={`${store.name} logo`}
                                fill
                                sizes="32px"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
                            style={{ backgroundColor: 'var(--sf-primary)' }}
                            aria-hidden="true"
                        >
                            {initial}
                        </div>
                    )}
                    <span className="text-lg leading-tight">{store.name}</span>
                </Link>

                {/* Navigation */}
                {theme.headerLayout !== 'centered' && (
                    <nav className="flex items-center gap-1">
                        <Link
                            href="/products"
                            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                            style={{ color: 'var(--sf-text)' }}
                        >
                            Productos
                        </Link>
                    </nav>
                )}

                {/* Centered layout navigation below brand */}
                {theme.headerLayout === 'centered' && (
                    <nav className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Link
                            href="/products"
                            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                            style={{ color: 'var(--sf-text)' }}
                        >
                            Productos
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
