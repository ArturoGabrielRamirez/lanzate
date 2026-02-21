/**
 * Storefront Layout Component
 *
 * Root layout for every public storefront page.
 * Injects theme CSS custom properties at the wrapper level so all
 * child components can consume `var(--sf-*)` without prop drilling.
 *
 * The CSS variable approach makes this fully forward-compatible:
 * when per-store themes are persisted in the database, only the
 * data layer changes — this component stays the same.
 */

import type { StorefrontLayoutProps } from '@/features/storefront/types/storefront.types';

export function StorefrontLayout({
    /* store, */
    theme,
    children,
}: StorefrontLayoutProps) {
    const borderRadiusMap = {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        full: '9999px',
    } as const;

    const fontFamilyMap = {
        sans: 'ui-sans-serif, system-ui, sans-serif',
        serif: 'ui-serif, Georgia, serif',
        mono: 'ui-monospace, SFMono-Regular, monospace',
    } as const;

    return (
        <div
            style={
                {
                    '--sf-primary': theme.primaryColor,
                    '--sf-bg': theme.backgroundColor,
                    '--sf-text': theme.textColor,
                    '--sf-radius': borderRadiusMap[theme.borderRadius],
                    '--sf-font': fontFamilyMap[theme.fontFamily],
                    fontFamily: 'var(--sf-font)',
                    color: 'var(--sf-text)',
                    backgroundColor: 'var(--sf-bg)',
                    minHeight: '100dvh',
                    display: 'flex',
                    flexDirection: 'column',
                } as React.CSSProperties
            }
        >
            {children}
        </div>
    );
}
