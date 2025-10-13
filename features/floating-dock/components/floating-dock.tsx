"use client"

import { Calendar, Camera, Home, Search, Store, User } from "lucide-react"

import { Link, usePathname } from "@/i18n/naviation"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

function FloatingDock() {

    const pathname = usePathname()

    return (
        <footer /* className="fixed bottom-0 px-8 z-50 flex justify-center items-center bg-background/85 backdrop-blur-[4px] rounded-lg py-4 shadow-2xl shadow-black drop-shadow-2xl md:hidden" */ className="fixed bottom-0 w-full p-2 z-50 xl:hidden container left-1/2 -translate-x-1/2">
            <div className="bg-primary/25 dark:bg-background/70 backdrop-blur-[4px] rounded-full py-2 px-2 flex items-center gap-3 justify-center border-t dark:border-t-foreground/20 border-b dark:border-b-background/90 border-b-primary/40 border-t-white/70">
                <Link href="/dashboard" className="flex items-center">
                    <IconButton
                        size="lg"
                        icon={Home}
                        className={cn(pathname.includes(`/dashboard`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                        active={pathname.includes(`/dashboard`)}
                    />
                </Link>
                <Link href="/stores" className="flex items-center">
                    <IconButton
                        size="lg"
                        icon={Store}
                        className={cn(pathname.includes(`/stores`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                        active={pathname.includes(`/stores`)}
                    />
                </Link>
                <Link href="/sale" className={cn("rounded-full bg-card/20 aspect-square size-12 flex items-center justify-center dark:border-foreground/40 border-white/40 border", pathname.includes(`/sale`) && "bg-blue-90/20 animate-pulse border-primary dark:border-primary")}>
                    <IconButton
                        size="md"
                        icon={() => (
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-2" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 15h-2.5a1.503 1.503 0 0 0-1.5 1.5a1.503 1.503 0 0 0 1.5 1.5h1a1.503 1.503 0 0 1 1.5 1.5a1.503 1.503 0 0 1-1.5 1.5H17m2 0v1m0-8v1m-6 6H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m12 3.12V9a2 2 0 0 0-2-2h-2"></path><path d="M16 10V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6m8 0H8m8 0h1m-9 0H7m1 4v.01M8 17v.01m4-3.02V14m0 3v.01"></path></g></svg>
                        )}
                        className={cn(pathname.includes(`/sale`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                        active={pathname.includes(`/sale`)}
                    />

                </Link>
                <IconButton
                    size="lg"
                    icon={Camera}
                    className={cn(pathname.includes(`/camera`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                    active={pathname.includes(`/camera`)}
                />
                <IconButton
                    size="lg"
                    icon={Search}
                    className={cn(pathname.includes(`/search`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                    active={pathname.includes(`/search`)}
                />
            </div>
            {/* <div className="flex items-center gap-4 relative z-10 ">

                <Link href="/events">
                    <IconButton
                        size="lg"
                        icon={Calendar}
                        className={cn(pathname.includes(`/events`) && "scale-125", "transition-all duration-300")}
                        active={pathname.includes(`/events`)}
                    />
                </Link>
                <Link href="/account">
                    <IconButton
                        size="lg"
                        icon={User}
                        className={cn(pathname.includes(`/account`) && "scale-125", "transition-all duration-300")}
                        active={pathname.includes(`/account`)}
                    />
                </Link>
            </div> */}
        </footer>
    )
}

export { FloatingDock }