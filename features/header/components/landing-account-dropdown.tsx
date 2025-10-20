"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/features/shadcn/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"
import { handleSignOut as handleSignOutAction } from "@/features/auth/actions"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function LandingAccountDropdown() {
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
                    <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/cart">Cart</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/my-orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        onClick={handleSignOut}
                        className="w-full text-left cursor-pointer"
                    >
                        Sign out
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { LandingAccountDropdown }