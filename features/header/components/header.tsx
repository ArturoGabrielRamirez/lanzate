"use server"

/* import { createServerSideClient } from "@/utils/supabase/server" */
import { AccountDropdown, NotificationsIcon, ThemeToggle, MobileMenu, LanguageSwitch } from "@/features/header/components"
import Link from "next/link"
import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { getUserInfo } from "@/features/layout/actions"

async function Header() {

    /* const supabase = createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser() */
    const { payload: user } = await getUserInfo()
    const t = await getTranslations("auth.buttons")

    return (
        <header className="flex items-center justify-between w-full bg-transparent backdrop-blur-[3px] text-accent-foreground p-4 py-2 md:py-4 fixed top-0 left-0 right-0 z-50 shadow-md">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-primary size-4 md:size-5 xl:size-6" />
                <h1 className="text-xl md:text-2xl xl:text-3xl">Lanzate</h1>
            </Link>

            <nav className="items-center hidden gap-4 md:flex">
                <LanguageSwitch />
                {!user && <Link href='/login' className='p-2 hover:underline hover:!text-primary'>{t("login")}</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline hover:text-primary'>{t("sign-up")}</Link>}
                <ThemeToggle />

                {user && <NotificationsIcon />}
                {user && <AccountDropdown />}
            </nav>

            <MobileMenu user={user} />
        </header>
    )
}

export default Header