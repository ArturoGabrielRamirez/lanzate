"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer"
import { ThemeToggle, NotificationsIcon, AccountDropdown } from "@/features/header/components"
import { Button } from "@/components/ui/button"

type MobileMenuProps = {
    user: any
}

function MobileMenu({ user }: MobileMenuProps) {
    const [open, setOpen] = useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="sm:w-[350px]">
                <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <DrawerTitle>Menu</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col p-4 space-y-4">
                    {!user && (
                        <Link
                            href="/login"
                            className="p-3 hover:bg-accent rounded-md transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Log In
                        </Link>
                    )}

                    {!user && (
                        <Link
                            href="/signup"
                            className="p-3 hover:bg-accent rounded-md transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Sign Up
                        </Link>
                    )}

                    {user && (
                        <Button asChild>
                            <Link
                                href="/stores"
                                className="p-3 hover:bg-accent rounded-md transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Stores
                            </Link>
                        </Button>
                    )}

                    {user && (
                        <Button asChild>
                            <Link
                                href="/account"
                                className="p-3 hover:bg-accent rounded-md transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                Account
                            </Link>
                        </Button>
                    )}

                    {user && (
                        <form action='/auth/signout' method='post' className="w-full">
                            <Button type='submit' className="p-3 hover:bg-accent rounded-md transition-colors w-full">
                                Sign out
                            </Button>
                        </form>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t">
                        {user && <NotificationsIcon />}
                        <ThemeToggle />
                    </div>


                    {/* {user && (
                        <div className="pt-4 border-t">
                            <AccountDropdown />
                        </div>
                    )} */}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default MobileMenu 