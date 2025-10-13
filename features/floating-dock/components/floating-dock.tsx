"use client"

import { Camera, Home, Search, Store, X } from "lucide-react"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useState } from "react"

import { Input } from "@/features/shadcn/components/input"
import { Link, usePathname } from "@/i18n/naviation"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"


function FloatingDock() {

    const pathname = usePathname()
    const [showSearch, setShowSearch] = useState(false)

    const handleSearchClick = () => {
        setShowSearch(true)
    }

    const handleSearchClose = () => {
        setShowSearch(false)
    }

    return (
        <footer className="fixed bottom-0 w-full p-2 z-50 xl:hidden container left-1/2 -translate-x-1/2">
            <motion.div className={cn("bg-primary/25 dark:bg-background/70 backdrop-blur-[4px] rounded-full py-2 px-2 flex items-center gap-2 border-t dark:border-t-foreground/20 border-b dark:border-b-background/90 border-b-primary/40 border-t-white/70 justify-between overflow-hidden transition-[padding,border] mx-auto", showSearch && "px-2 !border-primary/80 border-3 gap-1")} animate={{ paddingInline: showSearch ? "8px" : "12px ", width: showSearch ? "100%" : "fit-content" }}>
                <AnimatePresence mode="popLayout">
                    {showSearch && (
                        <motion.div key="close-search" exit={{ opacity: 0, y: 40, transition: { delay: 0.1 } }} initial={{ opacity: 0, y: 40, rotate: 360 }} animate={{ opacity: 1, y: 0, rotate: 0, transition: { delay: 0, duration: 0.5 } }} className="flex items-center">
                            <IconButton
                                size="lg"
                                icon={X}
                                className={cn(pathname.includes(`/search`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                                active={pathname.includes(`/search`)}
                                onClick={handleSearchClose}
                                key="close-search"
                            />
                        </motion.div>
                    )}
                    {showSearch && (
                        <motion.div key="input" exit={{ width: "0%", opacity: 0 }} initial={{ width: "0%", opacity: 0 }} animate={{ width: "100%", opacity: 1 }} className="shrink-0 grow-1">
                            <Input autoFocus className="!bg-transparent !border-none !ring-0 !outline-none h-10 md:h-12 px-0 w-full " />
                        </motion.div>
                    )}
                    {!showSearch && (
                        <motion.div key="dashboard" exit={{ opacity: 0, y: 40 }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
                            <Link href="/dashboard" className="flex items-center">
                                <IconButton
                                    size="lg"
                                    icon={Home}
                                    className={cn(pathname.includes(`/dashboard`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                                    active={pathname.includes(`/dashboard`)}
                                />
                            </Link>
                        </motion.div>
                    )}
                    {!showSearch && (
                        <motion.div key="stores" exit={{ opacity: 0, y: 40, transition: { delay: 0.1 } }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
                            <Link href="/stores" className="flex items-center" key="stores">
                                <IconButton
                                    size="lg"
                                    icon={Store}
                                    className={cn(pathname.includes(`/stores`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                                    active={pathname.includes(`/stores`)}
                                />
                            </Link>
                        </motion.div>
                    )}
                    {!showSearch && (
                        <motion.div key="sale" exit={{ opacity: 0, y: 40, transition: { delay: 0.2 } }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
                            <Link href="/sale" className={cn("rounded-full bg-card/20 aspect-square size-12 flex items-center justify-center dark:border-foreground/40 border-white/40 border", pathname.includes(`/sale`) && "bg-blue-90/20 animate-pulse border-primary dark:border-primary")} key="sale">
                                <IconButton
                                    size="md"
                                    icon={() => (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-2" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M21 15h-2.5a1.503 1.503 0 0 0-1.5 1.5a1.503 1.503 0 0 0 1.5 1.5h1a1.503 1.503 0 0 1 1.5 1.5a1.503 1.503 0 0 1-1.5 1.5H17m2 0v1m0-8v1m-6 6H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2m12 3.12V9a2 2 0 0 0-2-2h-2"></path><path d="M16 10V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6m8 0H8m8 0h1m-9 0H7m1 4v.01M8 17v.01m4-3.02V14m0 3v.01"></path></g></svg>
                                    )}
                                    className={cn(pathname.includes(`/sale`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                                    active={pathname.includes(`/sale`)}
                                />
                            </Link>
                        </motion.div>
                    )}
                    {!showSearch && (
                        <motion.div key="camera" exit={{ opacity: 0, y: 40, transition: { delay: 0.3 } }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }} className="flex items-center">
                            <IconButton
                                size="lg"
                                icon={Camera}
                                className={cn(pathname.includes(`/camera`) ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                                active={pathname.includes(`/camera`)}
                                key="camera"
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
                <motion.div className="flex items-center" animate={{ rotate: showSearch ? 360 : 0, transition: { duration: 0.6 } }}>
                    <IconButton
                        size="lg"
                        icon={Search}
                        className={cn(showSearch ? "text-primary" : "dark:text-foreground/40 text-white/80")}
                        active={showSearch}
                        onClick={handleSearchClick}
                        key="search"
                    />
                </motion.div>
            </motion.div>
        </footer>
    )
}

export { FloatingDock }