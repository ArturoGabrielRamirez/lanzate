'use client';

import { useTranslations } from 'next-intl';

import { SCROLL_THRESHOLD_FOR_FLOATING_NAV } from '@/features/header/constants';
import { useScrollThreshold } from '@/features/header/hooks';
import type { NavLinkWithUnderlineProps } from '@/features/header/types';
import { Link } from '@/i18n/naviation';
import { cn } from '@/lib/utils';

function NavLinkWithUnderline({ href, label, icon, isActive = false, prefetch = true, disabled = false }: NavLinkWithUnderlineProps) {
    const t = useTranslations();
    const shouldShowIcon = useScrollThreshold(SCROLL_THRESHOLD_FOR_FLOATING_NAV);

    return (
        <Link
            href={href}
            prefetch={prefetch}
            className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors group",
                isActive ? 'text-primary' : 'text-foreground hover:text-primary shrink-0',
                disabled ? 'pointer-events-none opacity-50' : ''
            )}
        >
            <span className="inline-flex items-center gap-2">
                {shouldShowIcon && icon}
                {shouldShowIcon ? null : t(label)}
            </span>
            <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
            />
        </Link>
    );
};

export { NavLinkWithUnderline };