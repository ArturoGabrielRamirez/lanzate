"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import Link from "next/link"
import { handleSignOut as handleSignOutAction } from "@/features/auth/actions"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type AccountDropdownProps = {
    image?: string
}

function AccountDropdown({ image }: AccountDropdownProps) {
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
                <Avatar className="ring-primary ring-1 cursor-pointer size-10">
                    <AvatarImage src={image} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={handleClick} className="cursor-pointer" asChild>
                    <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer" asChild>
                    <Link href="#" >Sign out</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AccountDropdown