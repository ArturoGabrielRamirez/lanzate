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
import { ThemeToggle, NotificationsIcon } from "@/features/header/components"
import { Button } from "@/components/ui/button"
import { signOut } from "@/features/auth/actions/handleSignOut"


type MobileMenuProps = {
    user: any
}

function MobileMenu({ user }: MobileMenuProps) {
    const [open, setOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        setOpen(false)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="sm:w-[350px]">
                <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <DrawerTitle>Menu</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon">
                                <X className="w-5 h-5" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col p-4 space-y-4">
                    {!user && (
                        <Link
                            href="/login"
                            className="p-3 transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Log In
                        </Link>
                    )}

                    {!user && (
                        <Link
                            href="/signup"
                            className="p-3 transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Sign Up
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/stores"
                            className="p-3 transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Stores
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/account"
                            className="p-3 transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Account
                        </Link>
                    )}

                    {user && (
                        <Button 
                            onClick={handleSignOut}
                            className="justify-start w-full p-3 transition-colors rounded-md hover:bg-accent"
                            variant="ghost"
                        >
                            Sign out
                        </Button>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t">
                        {user && <NotificationsIcon />}
                        <ThemeToggle />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default MobileMenu