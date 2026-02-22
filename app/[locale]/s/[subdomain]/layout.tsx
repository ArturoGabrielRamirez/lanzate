/**
 * Storefront Shell Layout
 *
 * Shared layout for all public storefront pages under /s/[subdomain].
 * Fetches store data once (store + theme + section config) and provides:
 *
 * - StorefrontLayout   — injects CSS custom properties (--sf-*)
 * - StorefrontHeader   — sticky header with logo/nav
 * - StorefrontFooter   — footer (if theme.showFooter is true)
 * - StorefrontContextProvider — exposes store data to client components
 *
 * Individual pages only need to render their <main> content.
 */

import { notFound } from 'next/navigation';

import {
    StorefrontFooter,
    StorefrontHeader,
    StorefrontLayout,
} from '@/features/storefront/components';
import { StorefrontContextProvider } from '@/features/storefront/context/storefront-context';
import { StorefrontShellLayoutProps } from '@/features/storefront/types/layout.types';
import { getStorePublicDataAction } from '@/features/stores/actions';

export default async function StorefrontShellLayout({
    params,
    children,
}: StorefrontShellLayoutProps) {
    const { subdomain } = await params;

    const result = await getStorePublicDataAction(subdomain);

    if (result.hasError || !result.payload) {
        notFound();
    }

    const { store, theme, homeSections } = result.payload;

    return (
        <StorefrontLayout store={store} theme={theme}>
            <StorefrontHeader store={store} theme={theme} />
            <StorefrontContextProvider value={{ store, theme, homeSections }}>
                {children}
            </StorefrontContextProvider>
            {theme.showFooter && <StorefrontFooter store={store} />}
        </StorefrontLayout>
    );
}
