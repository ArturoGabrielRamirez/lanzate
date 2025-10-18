import { Suspense } from "react"

import { OrdersListWidget, OrdersListWidgetSkeleton } from "@/features/orders/components"
import { SectionContainer, StoreBalanceBig, StoreBalanceBigSkeleton } from "@/features/stores/components"

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