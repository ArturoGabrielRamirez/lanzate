"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { handleSignOut } from "@/features/auth/actions";
import { Link, redirect } from "@/i18n/naviation";

function LogoutLink() {

    const t = useTranslations('')

    const handleLogoutClick = async () => {
        const res = await handleSignOut()

        if (res.hasError) {
            return toast.error(res.message);
        }

        redirect({ href: '/login', locale: 'en' })
    }

    return (
        <Link href="#" onClick={handleLogoutClick}>{t('feature/header.navigation.signout')}</Link>
    )
}

export { LogoutLink };