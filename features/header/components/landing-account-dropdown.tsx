"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { handleSignOut as handleSignOutAction } from "@/features/auth/actions"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Button } from "@/features/shadcn/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"

function LandingAccountDropdown() {
    const t = useTranslations('layout.header.accountDropdown')
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    const handleSignOut = async () => {
        await handleSignOutAction()
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <IconButton
                    size="md"
                    icon={() => <User />}
                    onClick={handleClick}
                />
                {/* <Button size="icon" variant={"outline"} onClick={handleClick}>
                    <User />
                </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/account">{t('account')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/cart">{t('cart')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/my-orders">{t('myOrders')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        onClick={handleSignOut}
                        className="w-full text-left cursor-pointer"
                    >
                        {t('signOut')}
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { LandingAccountDropdown }