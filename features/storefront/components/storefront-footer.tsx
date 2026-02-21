/**
 * Storefront Footer Component
 *
 * Minimal footer for the public storefront.
 * Only rendered when theme.showFooter is true (controlled by StorefrontLayout parent).
 */

import { Text } from '@/features/global/components/typography/text/text';
import type { StorefrontFooterProps } from '@/features/storefront/types/storefront.types';

export function StorefrontFooter({ store }: StorefrontFooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="mt-auto border-t bg-card"
            style={{ borderColor: 'color-mix(in srgb, var(--sf-text) 12%, transparent)' }}
        >
            <div className="container mx-auto px-4 py-6">
                <Text
                    size='sm'
                    className="text-center"
                    style={{ color: 'color-mix(in srgb, var(--sf-text) 60%, transparent)' }}
                >
                    © {currentYear}{' '}
                    <span className="font-medium" style={{ color: 'var(--sf-text)' }}>
                        {store.name}
                    </span>
                    . Todos los derechos reservados.
                </Text>
            </div>
        </footer>
    );
}
