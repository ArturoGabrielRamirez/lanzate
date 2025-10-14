"use client"

import { useTranslations } from "next-intl";

import { isActiveRoute } from '@/features/header/utils';
import { Button } from "@/features/shadcn/components/button";
import { Link, usePathname } from "@/i18n/naviation";
import { cn } from "@/lib/utils";

function HeaderLoginLink() {

    const t = useTranslations();
    const pathname = usePathname();
    const isHome = isActiveRoute(pathname, '/');

    return (
        <Button asChild size="lg" className={cn('bg-transparent border border-border dark:!border-primary dark:hover:!bg-primary/20', !isHome && 'text-primary hover:!text-primary-foreground')}>
            <Link href="/login">{t('feature/header.navigation.login')}</Link>
        </Button>
    )
}

export { HeaderLoginLink }