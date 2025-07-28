"use server"
import { createServerSideClient } from "@/utils/supabase/server"
import { AccountDropdown, NotificationsIcon, ThemeToggle, MobileMenu } from "@/features/header/components"
import Link from "next/link"
import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"

async function Header() {

    const supabase = createServerSideClient()
    const { data: { user } } = await supabase.auth.getUser()
    const t = await getTranslations("auth.buttons")

    return (
        <header className="flex items-center justify-between w-full bg-transparent backdrop-blur-[3px] text-accent-foreground p-4 fixed top-0 left-0 right-0 z-50 shadow-md">
            <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="text-primary" />
                <h1>Lanzate</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
                {!user && <Link href='/login' className='p-2 hover:underline hover:!text-primary'>{t("login")}</Link>}
                {!user && <Link href='/signup' className='p-2 hover:underline hover:text-primary'>{t("signup")}</Link>}
                {/* {user && <Link href='/stores' className='p-2 hover:underline hover:!text-primary'>Stores</Link>} */}
                <ThemeToggle />

                {user && <NotificationsIcon />}
                {user && <AccountDropdown />}
            </nav>

            {/* Mobile Navigation */}
            <MobileMenu user={user} />
        </header>
    )
}

export default Header