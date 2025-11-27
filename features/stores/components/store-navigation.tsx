"use client"

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
                            <Item 
                                variant="outline" 
                                className={cn(
                                    "p-2 group/item truncate aspect-square gap-1",
                                    isActive && "border-primary bg-primary/5"
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

