import Link from "next/link"
import { Suspense } from "react"

import { HelpCard } from "@/features/dashboard/components"
import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderServer, StoreHeaderSkeleton, StoreHeaderTinyWidgets } from "@/features/stores/components"
import { STORES_NAVIGATION_LINKS } from "@/features/stores/constants"

type StoreDetailsPageProps = {
    params: Promise<{ locale: string, slug: string }>
}

async function StoreDetailsPage({ params }: StoreDetailsPageProps) {

    const { slug } = await params

    return (
        <>
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
        </>
    )
}
export default StoreDetailsPage