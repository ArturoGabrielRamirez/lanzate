import Link from "next/link"
import { Suspense } from "react"

import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderServer, StoreHeaderSkeleton } from "@/features/stores/components"
import { STORES_NAVIGATION_LINKS } from "@/features/stores/constants"

type StoreDetailsPageProps = {
    params: Promise<{ locale: string, slug: string }>
}

async function StoreDetailsPage({ params }: StoreDetailsPageProps) {

    const { slug } = await params

    return (
        <div className="grow flex flex-col gap-4">
            <SectionContainer title="Tu tienda">
                <Suspense fallback={<StoreHeaderSkeleton />}>
                    <StoreHeaderServer slug={slug} />
                </Suspense>
            </SectionContainer>
            <SectionContainer title="Tu balance">
                <Suspense fallback={<StoreBalanceBigSkeleton />}>
                    <StoreBalanceBig slug={slug} />
                </Suspense>
            </SectionContainer>
            <SectionContainer title="Tus ordenes">
                <Suspense fallback={<OrdersListWidgetSkeleton />}>
                    <OrdersListWidget slug={slug} />
                </Suspense>
            </SectionContainer>
            <SectionContainer title="Tus atajos">
                <div className="pb-20 grid grid-cols-4 gap-4">
                    {STORES_NAVIGATION_LINKS.map((link) => (
                        <Item key={link.href} variant="outline" className="flex-col items-center p-2 lg:p-4 bg-card/50 group/item" asChild>
                            <Link href={link.href}>
                                <ItemMedia variant="icon" className="mx-auto size-9 bg-transparent border-none text-muted-foreground group-hover/item:text-primary group-hover/item:scale-110 transition-all duration-100">
                                    {link.icon}
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className="font-medium text-xs md:text-sm lg:text-base text-muted-foreground group-hover/item:text-foreground">{link.label}</ItemTitle>
                                    <ItemDescription className="hidden md:block text-xs text-muted-foreground group-hover/item:text-foreground">{link.description}</ItemDescription>
                                </ItemContent>
                            </Link>
                        </Item>
                    ))}
                </div>
            </SectionContainer>
        </div>
    )
}
export default StoreDetailsPage