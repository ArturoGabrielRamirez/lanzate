'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { handleSignOut } from '@/features/auth/actions';
import { Link, redirect } from '@/i18n/naviation';

function LogoutLink() {

    const t = useTranslations('layout.header.navigation.auth')

    const handleLogoutClick = async () => {
        const res = await handleSignOut()

        if (res.hasError) {
            return toast.error(res.message);
        }

        redirect({ href: '/login', locale: 'en' })
    }

    return (
        <Link href="#" onClick={handleLogoutClick}>{t('signout')}</Link>
    )
}

export { LogoutLink };