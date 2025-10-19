'use client';

import Link from 'next/link';

import { BrandLogoProps } from '@/features/header/types';
import { isActiveRoute } from '@/features/header/utils';
import { usePathname } from '@/i18n/naviation';
import { cn } from '@/lib/utils';

function BrandLogo({ hasText = true }: BrandLogoProps) {

    const pathname = usePathname()

    const isHome = isActiveRoute(pathname, '/')

    return (
        <Link href="/" className={cn("flex items-center gap-2 group", !isHome && "text-primary")}>
            <svg className='size-7 md:size-8' xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24"><g fill="none" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m1 18.127l11 3m0 0l11-3m-22 0l5.493-1.439m-5.493 6v-4.436m22 0v4.436m-11 .5v-2.061m3.5-15.065c0 1.933-.583 7-3.5 7S8.5 8 8.5 6.062c0-3.5 3.5-5.25 3.5-5.25s3.5 1.75 3.5 5.25"></path><path d="M12 5.937a.5.5 0 0 1 0-1m0 1a.5.5 0 0 0 0-1"></path><path strokeLinecap="round" strokeLinejoin="round" d="M10.01 17.881v-1.008a2.017 2.017 0 0 1 3.99.08v.928m-4.317-5.72l-.808.405a5.3 5.3 0 0 0-1.242.916a.653.653 0 0 1-1.13-.417a3.49 3.49 0 0 1 2.113-3.61m5.701 2.706l.808.405c.457.243.875.551 1.242.916a.654.654 0 0 0 1.13-.417a3.49 3.49 0 0 0-2.113-3.61M23 18.127l-5.493-1.439" className="size-5 xl:size-6"></path></g></svg>
            {hasText && <span className={cn("hidden md:inline-block text-xl font-bold text-primary-foreground", !isHome && "text-foreground")}>Lanzate</span>}
        </Link>
    );
};

export { BrandLogo };