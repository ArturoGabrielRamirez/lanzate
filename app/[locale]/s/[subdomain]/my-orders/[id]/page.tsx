import { Suspense } from "react"
import { Title } from "@/features/layout/components"
import OrderDetailsContainer from "@/features/store-orders/components/order-details-container"
import OrderDetailsSkeleton from "@/features/store-orders/components/order-details-skeleton"

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function OrderDetailsPage({ params }: Props) {
    const { id } = await params

    return (
        <section className="p-4 grow flex flex-col pb-8">
            <Title
                title={`Order #${id}`}
                breadcrumbs={[
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
        </section>
    )
}
