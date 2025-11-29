import { Suspense } from "react"

import { HelpCard } from "@/features/dashboard/components"
import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton, StoreHeaderTinyWidgets } from "@/features/stores/components"

type StoreDetailsPageProps = {
    params: Promise<{ locale: string, slug: string }>
}

async function StoreDetailsPage({ params }: StoreDetailsPageProps) {

    const { slug } = await params

    return (
        <>
            <SectionContainer title="Tu balance" className="md:hidden">
                <Suspense fallback={<StoreBalanceBigSkeleton />}>
                    <StoreBalanceBig slug={slug} />
                </Suspense>
            </SectionContainer>
            <SectionContainer title="Tu resumen" className="@container md:hidden">
                <StoreHeaderTinyWidgets slug={slug} />
            </SectionContainer>
            <SectionContainer title="Tus ordenes" moreLink={`/stores/${slug}/orders`}>
                <Suspense fallback={<OrdersListWidgetSkeleton />}>
                    <OrdersListWidget slug={slug} />
                </Suspense>
            </SectionContainer>
            <HelpCard className="md:hidden" />
        </>
    )
}
export default StoreDetailsPage