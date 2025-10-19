import { Suspense } from "react"

import { HelpCard } from "@/features/dashboard/components"
import { GlobalSearch } from "@/features/global-search/components"
import { getUserInfo } from "@/features/layout/actions"
import { PageContainer } from "@/features/layout/components"
import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { MobileSidebar, SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderServer, StoreHeaderSkeleton, StoreHeaderTinyWidgets } from "@/features/stores/components"
import { STORES_NAVIGATION_LINKS } from "@/features/stores/constants"
import { StoreDetailsLayoutProps } from "@/features/stores/types"
import { Link, redirect } from "@/i18n/naviation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params

    const { payload: store, hasError: storeError } = await getStoreBasicsBySlugAction(slug)

    if (storeError || !store) {
        return {
            title: "Store not found"
        }
    }

    return {
        title: store.name
    }
}


async function StoreDetailsLayout({ children, params }: StoreDetailsLayoutProps) {

    const { slug } = await params

    const { payload: user, hasError: userError } = await getUserInfo()

    if (!user) return redirect({ href: "/login", locale: "es" })

    if (userError) {
        return null
    }

    const { payload: store, hasError: storeError } = await getStoreBasicsBySlugAction(slug)

    if (storeError) {
        return null
    }

    if (!store) {
        return redirect({ href: "/stores", locale: "es" })
    }

    return (
        <PageContainer className="gap-4 flex flex-col lg:gap-8">
            <div className="grow flex flex-col gap-8">
                <div className="lg:hidden flex flex-col gap-4">
                    <Suspense fallback={<StoreHeaderSkeleton />}>
                        <StoreHeaderServer slug={slug} />
                    </Suspense>
                    {children}
                    <Suspense>
                        <SectionContainer title="Looking for something?">
                            <GlobalSearch userId={user.id} />
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
                {/* <MobileSidebar slug={slug} userId={user.id} /> */}
                <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] lg:gap-8">
                    <div className="flex flex-col gap-8 sticky top-24">
                        <Suspense fallback={<StoreHeaderSkeleton />}>
                            <StoreHeaderServer slug={slug} />
                        </Suspense>
                        <Suspense>
                            <SectionContainer title="Looking for something?">
                                <GlobalSearch userId={user.id} />
                            </SectionContainer>
                        </Suspense>
                        <SectionContainer title="Tu resumen">
                            <StoreHeaderTinyWidgets slug={slug} />
                        </SectionContainer>
                        <SectionContainer title="Tus atajos" className="@container">
                            <ItemGroup className="grid @md:grid-cols-4 grid-cols-3 gap-4">
                                {STORES_NAVIGATION_LINKS.map((link) => (
                                    <Item key={link.href} variant="outline" className="flex-col items-center p-2 @md:p-4 group/item gap-2 @lg:gap-4" asChild>
                                        <Link href={`/stores/${slug}${link.href}`}>
                                            <ItemMedia variant="icon" className="mx-auto size-6 bg-transparent border-none text-muted-foreground group-hover/item:text-primary group-hover/item:scale-125 transition-all duration-100">
                                                {link.icon}
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle className="font-medium text-xs md:text-sm text-muted-foreground group-hover/item:text-foreground">{link.label}</ItemTitle>
                                            </ItemContent>
                                        </Link>
                                    </Item>
                                ))}
                            </ItemGroup>
                        </SectionContainer>
                        <HelpCard />
                    </div>
                    <div className="flex flex-col gap-8">
                        {children}
                    </div>
                </div>
            </div>
        </PageContainer>
    )
}
export default StoreDetailsLayout