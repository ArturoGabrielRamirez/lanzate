'use client';

import { useMotionValueEvent, useScroll } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { NavLinkWithUnderlineProps } from '@/features/header/types';
import { Link } from '@/i18n/naviation';
import { cn } from '@/lib/utils';

function NavLinkWithUnderline({ href, label, icon, isActive = false, prefetch = true, disabled = false }: NavLinkWithUnderlineProps) {

    const t = useTranslations();
    const { scrollY } = useScroll()
    const [shouldShowIcon, setShouldShowIcon] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setShouldShowIcon(true)
        } else {
            setShouldShowIcon(false)
        }
    })

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