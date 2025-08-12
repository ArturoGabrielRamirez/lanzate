"use server"

import { AccountDropdown, NotificationsIcon, ThemeToggle, MobileMenu, LanguageSwitch } from "@/features/header/components"
import Link from "next/link"
import { Rocket } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { getUserInfo } from "@/features/layout/actions"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";

async function Header() {

    const { payload: user } = await getUserInfo()
    const t = await getTranslations("auth.buttons")

    return (
        <Navbar shouldHideOnScroll maxWidth="2xl" position="sticky" className="dark:bg-black/80 bg-content1">
            <NavbarBrand>
                <Link href="/" className="flex items-center gap-2">
                    <Rocket className="text-primary size-5 md:size-5 xl:size-6" />
                    <h1 className="text-xl md:text-2xl xl:text-3xl">Lanzate</h1>
                </Link>
            </NavbarBrand>
            <NavbarContent justify="center" className="hidden md:flex gap-4 items-center">
                {!user && (
                    <NavbarItem>
                        <Link href='/login' className='hover:underline hover:!text-primary'>{t("login")}</Link>
                    </NavbarItem>
                )}
                {!user && (
                    <NavbarItem>
                        <Link href='/signup' className='hover:underline hover:text-primary'>{t("sign-up")}</Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <NavbarContent justify="end" className="hidden md:flex gap-4 items-center">
                <LanguageSwitch />
                <ThemeToggle />
                {user && <NotificationsIcon />}
                {user && <AccountDropdown />}
            </NavbarContent>
            <NavbarContent justify="end" className="md:hidden">
                <MobileMenu user={user} />
            </NavbarContent>
        </Navbar>
    )
}

export default Header