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
import { handleSignOut as handleSignOutAction } from "@/features/auth/actions"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { User } from "@prisma/client"
import { redirect } from "next/navigation"
import { toast } from "sonner"


type MobileMenuProps = {
    user?: User | null
}

function MobileMenu({ user }: MobileMenuProps) {
    const [open, setOpen] = useState(false)

    const handleSignOut = async () => {
        toast.loading('Please wait, we are signing you out of your account...', { richColors: true })
        await handleSignOutAction()
        setOpen(false)
        toast.success('You have been signed out of your account successfully and you will be redirected to the login page', { richColors: true })
        toast.dismiss()
        redirect('/login')
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <IconButton
                    active={open}
                    icon={Menu}
                    className="justify-end lg:hidden"
                />
            </DrawerTrigger>
            <DrawerContent className="">
                <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <DrawerTitle>Menu</DrawerTitle>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="sm">
                                <X className="size-5" />
                                <span className="sr-only">Close menu</span>
                            </Button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col p-4 space-y-4">
                    {!user && (
                        <Link
                            href="/"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Home
                        </Link>
                    )}
                    {!user && (
                        <Link
                            href="/login"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Log In
                        </Link>
                    )}

                    {!user && (
                        <Link
                            href="/signup"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Sign Up
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/dashboard"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/stores"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Stores
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/sale"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            New Sale
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/events"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Events
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="/account"
                            className="transition-colors rounded-md hover:bg-accent"
                            onClick={() => setOpen(false)}
                        >
                            Account
                        </Link>
                    )}

                    {user && (
                        <Link
                            href="#"
                            className="justify-start w-full transition-colors rounded-md hover:bg-accent"
                            onClick={handleSignOut}
                        >
                            Sign out
                        </Link>
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