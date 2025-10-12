'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';

import { BrandLogoProps } from '@/features/header/types';
import { usePathname } from '@/i18n/naviation';
import { cn } from '@/lib/utils';

function BrandLogo({ hasText = true }: BrandLogoProps) {

    const pathname = usePathname()

    const isHome = pathname === '/'

    return (
        <Link href="/" className={cn("flex items-center gap-2 group", !isHome && "text-primary")}>
            <Rocket className={cn("size-7 md:size-8 text-primary-foreground dark:text-primary transition-transform group-hover:scale-110", !isHome && "text-primary")} />
            {hasText && <span className={cn("hidden md:inline-block text-xl font-bold text-primary-foreground", !isHome && "text-foreground")}>Lanzate</span>}
        </Link>
    );
};

export { BrandLogo };