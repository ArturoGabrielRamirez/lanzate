"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

function AccountDropdown() {

    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"outline"} onClick={handleClick}>
                    <User />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/account">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClick}>
                    <Link href="/stores">Stores</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClick}>
                    <form action='/auth/signout' method='post' className="w-full">
                        <Button type='submit' className="p-0 h-5 hover:!bg-transparent w-full justify-start" variant={"ghost"}>
                            Sign out
                        </Button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default AccountDropdown