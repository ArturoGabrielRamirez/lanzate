import { Suspense } from "react"
import { Title } from "@/features/layout/components"
import OrderDetailsContainer from "@/features/store-orders/components/order-details-container"
import OrderDetailsSkeleton from "@/features/store-orders/components/order-details-skeleton"
import PageContainer from "@/features/layout/components/page-container"

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function OrderDetailsPage({ params }: Props) {
    const { id } = await params

    return (
        <PageContainer>
            <Title
                title={`Order #${id}`}
                breadcrumbs={[
                    { label: "Account", href: "/account" },
                    { label: "My Orders", href: "/my-orders" },
                    { label: `Order #${id}`, href: `/my-orders/${id}` }
                ]}
                homePath="/"
            />

            <div className="grow flex flex-col">
                <Suspense fallback={<OrderDetailsSkeleton />}>
                    <OrderDetailsContainer orderId={id} />
                </Suspense>
            </div>
        </PageContainer>
    )
}
