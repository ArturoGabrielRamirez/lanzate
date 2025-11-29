"use client"

import * as motion from "motion/react-client"

import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { STORES_NAVIGATION_LINKS } from "@/features/stores/constants"
import { usePathname, Link } from "@/i18n/naviation"
import { cn } from "@/lib/utils"

interface StoreNavigationProps {
    slug: string
}

export function StoreNavigation({ slug }: StoreNavigationProps) {
    const pathname = usePathname()

    return (
        <ItemGroup className="grid @md:grid-cols-6 grid-cols-3 gap-4">
            {STORES_NAVIGATION_LINKS.map((link) => {
                const linkPath = `/stores/${slug}${link.href === "/" ? "" : link.href}`

                // Exact match for root path, startsWith for sub-paths
                const isActive = link.href === "/"
                    ? pathname === `/stores/${slug}`
                    : pathname.startsWith(linkPath)

                return (
                    <Tooltip key={link.href}>
                        <TooltipTrigger asChild>
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Item
                                    variant="outline"
                                    className={cn(
                                        "p-2 group/item truncate aspect-square gap-1 bg-card opacity-50 hover:opacity-100 transition-all duration-100 hover:!bg-card hover:shadow-sm",
                                        isActive && "border-primary bg-primary/10 opacity-100 scale-105 shadow-sm"
                                    )}
                                    asChild
                                >
                                    <Link href={`/stores/${slug}${link.href}`}>
                                        <ItemMedia
                                            variant="icon"
                                            className={cn(
                                                "mx-auto size-6 bg-transparent border-none text-muted-foreground group-hover/item:text-primary group-hover/item:scale-125 transition-all duration-100 self-center",
                                                isActive && "text-primary scale-125"
                                            )}
                                        >
                                            {link.icon}
                                        </ItemMedia>
                                        {isActive && (
                                            <ItemContent className="truncate animate-in fade-in slide-in-from-bottom-1 duration-300 w-full">
                                                <ItemTitle className="font-medium text-xs text-foreground truncate text-center w-full block">
                                                    {link.label}
                                                </ItemTitle>
                                            </ItemContent>
                                        )}
                                    </Link>
                                </Item>
                            </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                            {link.label}
                        </TooltipContent>
                    </Tooltip>
                )
            })}
        </ItemGroup>
    )
}

