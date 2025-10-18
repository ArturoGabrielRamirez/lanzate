import Link from "next/link"
import { Suspense } from "react"

import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderServer, StoreHeaderSkeleton, StoreHeaderTinyWidgets } from "@/features/stores/components"
import { STORES_NAVIGATION_LINKS } from "@/features/stores/constants"

type StoreDetailsPageProps = {
    params: Promise<{ locale: string, slug: string }>
}

async function StoreDetailsPage({ params }: StoreDetailsPageProps) {

    const { slug } = await params

    return (
        <div className="grow flex flex-col gap-8">
            <div className="lg:hidden flex flex-col gap-4">
                <SectionContainer title="Tu tienda" moreLink={`/stores/${slug}/account`}>
                    <Suspense fallback={<StoreHeaderSkeleton />}>
                        <StoreHeaderServer slug={slug} />
                    </Suspense>
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
                                    <ItemMedia variant="icon" className="mx-auto size-9 bg-transparent border-none text-muted-foreground group-hover/item:text-primary group-hover/item:scale-110 transition-all duration-100">
                                        {link.icon}
                                    </ItemMedia>
                                    <ItemContent>
                                        <ItemTitle className="font-medium text-xs md:text-sm lg:text-base text-muted-foreground group-hover/item:text-foreground">{link.label}</ItemTitle>
                                        {/* <ItemDescription className="hidden md:block text-xs text-muted-foreground group-hover/item:text-foreground">{link.description}</ItemDescription> */}
                                    </ItemContent>
                                </Link>
                            </Item>
                        ))}
                    </ItemGroup>
                </SectionContainer>
            </div>
            <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                <div className="flex flex-col gap-8">
                    <SectionContainer title="Tu tienda" moreLink={`/stores/${slug}/account`}>
                        <Suspense fallback={<StoreHeaderSkeleton />}>
                            <StoreHeaderServer slug={slug} />
                        </Suspense>
                    </SectionContainer>
                    <SectionContainer title="Tu resumen">
                        <StoreHeaderTinyWidgets slug={slug} />
                    </SectionContainer>
                    <SectionContainer title="Tus atajos" className="@container">
                        <ItemGroup className="grid @md:grid-cols-4 grid-cols-3 gap-4">
                            {STORES_NAVIGATION_LINKS.map((link) => (
                                <Item key={link.href} variant="outline" className="flex-col items-center p-2 @md:p-4 bg-card/50 group/item gap-2 @lg:gap-4" asChild>
                                    <Link href={`/stores/${slug}${link.href}`}>
                                        <ItemMedia variant="icon" className="mx-auto size-9 bg-transparent border-none text-muted-foreground group-hover/item:text-primary group-hover/item:scale-110 transition-all duration-100">
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
                <div className="flex flex-col gap-8">
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
                </div>
            </div>
        </div>
    )
}
export default StoreDetailsPage