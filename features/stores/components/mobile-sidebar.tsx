import { Suspense } from "react"

import { GlobalSearch } from "@/features/global-search/components"
import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderServer, StoreHeaderSkeleton, StoreHeaderTinyWidgets } from "@/features/stores/components"
import { STORES_NAVIGATION_LINKS } from "@/features/stores/constants"
import { Link } from "@/i18n/naviation"

interface MobileSidebarProps {
    slug: string
    userId: number
}

function MobileSidebar({ slug, userId }: MobileSidebarProps) {
    return (
        <div className="lg:hidden flex flex-col gap-4">
            <Suspense fallback={<StoreHeaderSkeleton />}>
                <StoreHeaderServer slug={slug} />
            </Suspense>
            <Suspense>
                <SectionContainer title="Looking for something?">
                    <GlobalSearch userId={userId} />
                </SectionContainer>
            </Suspense>
            <SectionContainer title="Tu resumen" className="@container">
                <StoreHeaderTinyWidgets slug={slug} />
            </SectionContainer>
            <SectionContainer title="Tu balance">
                <Suspense fallback={<StoreBalanceBigSkeleton />}>
                    <StoreBalanceBig slug={slug} />
                </Suspense>
            </SectionContainer>
            <SectionContainer title="Tus ordenes" moreLink={`/stores/${slug}/orders`}>
                <Suspense fallback={<OrdersListWidgetSkeleton />}>
                    <OrdersListWidget slug={slug} />
                </Suspense>
            </SectionContainer>
            <SectionContainer title="Tus atajos">
                <ItemGroup className="pb-20 grid grid-cols-4 @container gap-4">
                    {STORES_NAVIGATION_LINKS.map((link) => (
                        <Item key={link.href} variant="outline" className="flex-col items-center p-2 lg:p-4 bg-card/50 group/item" asChild>
                            <Link href={`/stores/${slug}${link.href}`}>
                                <ItemMedia variant="icon" className="mx-auto size-8 bg-transparent border-none text-muted-foreground group-hover/item:text-primary group-hover/item:scale-110 transition-all duration-100">
                                    {link.icon}
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className="font-medium text-xs md:text-sm lg:text-base text-muted-foreground group-hover/item:text-foreground">{link.label}</ItemTitle>
                                </ItemContent>
                            </Link>
                        </Item>
                    ))}
                </ItemGroup>
            </SectionContainer>
        </div>
    )
}

export { MobileSidebar }