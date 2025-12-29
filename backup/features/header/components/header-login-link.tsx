'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/features/shadcn/components/button';
import { Link } from '@/i18n/naviation';

function HeaderLoginLink() {

    const t = useTranslations('layout.header.navigation.auth');

    return (
        <Button asChild size="lg" variant="outline">
            <Link href="/login">{t('login')}</Link>
        </Button>
    )
}

export { HeaderLoginLink }