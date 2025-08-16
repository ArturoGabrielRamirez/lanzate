import { NotificationsIcon, ThemeToggle, MobileMenu, LanguageSwitch } from "@/features/header/components"
import Link from "next/link"
import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { getUserInfo } from "@/features/layout/actions"
import HeaderContainer from "./header-container"
import NavbarLink from "./navbar-link"

async function Header() {

    const { payload: user } = await getUserInfo()
    const t = await getTranslations("auth.buttons")

    return (
        <HeaderContainer>
            <Link href="/" className="text-2xl font-bold flex items-center gap-2" id="welcome">
                <Rocket className="text-primary size-5 md:size-5 xl:size-6" />
                <h1 className="text-xl md:text-2xl xl:text-3xl">Lanzate</h1>
            </Link>

            <nav className="items-center hidden gap-4 md:flex">
                {!user && <NavbarLink href='/login'>{t("login")}</NavbarLink>}
                {!user && <NavbarLink href='/signup'>{t("sign-up")}</NavbarLink>}
                {user && <NavbarLink href='/dashboard'>Dashboard</NavbarLink>}
                {user && <NavbarLink href='/stores'>Stores</NavbarLink>}
                {user && <NavbarLink href='/events'>Events</NavbarLink>}
                <LanguageSwitch />
                <ThemeToggle />

                {user && <NotificationsIcon />}
                {/* {user && <AccountDropdown />} */}
            </nav>

            <MobileMenu user={user} />
        </HeaderContainer >
    )
}

export default Header