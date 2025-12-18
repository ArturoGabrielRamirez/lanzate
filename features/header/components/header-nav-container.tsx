'use client';

import * as motion from 'motion/react-client';
import { type ReactNode } from 'react';

import { BrandLogo } from '@/features/header/components/brand-logo';
import { SettingsToolbar } from '@/features/header/components/settings-toolbar';
import { SCROLL_THRESHOLD_FOR_FLOATING_NAV } from '@/features/header/constants';
import { useScrollThreshold } from '@/features/header/hooks';
import { cn } from '@/lib/utils';

function HeaderNavContainer({ children }: { children: ReactNode }) {
    const shouldBlurBackground = useScrollThreshold(SCROLL_THRESHOLD_FOR_FLOATING_NAV);

    const headerLogoConfig = {
        initial: { opacity: 0, y: -100 },
        animate: { opacity: 1, y: 0 },
    }


    return (
        <nav className={cn("hidden xl:flex items-center fixed left-1/2 -translate-x-1/2 gap-4 transition-all", shouldBlurBackground && "backdrop-blur-sm bg-background/50 border-t border-t-[color-mix(in_oklch,var(--background),white_30%)] border-b border-b-[color-mix(in_oklch,var(--background)_50%,black_5%)] rounded-full py-3 mt-4 px-6 shadow-2xl drop-shadow-2xl")}>
            {shouldBlurBackground && (
                <motion.div {...headerLogoConfig}>
                    <BrandLogo hasText={false} />
                </motion.div>
            )}
            {children}
            {shouldBlurBackground && (
                <motion.div {...headerLogoConfig}>
                    <SettingsToolbar />
                </motion.div>
            )}
        </nav>
    )
}

export { HeaderNavContainer };