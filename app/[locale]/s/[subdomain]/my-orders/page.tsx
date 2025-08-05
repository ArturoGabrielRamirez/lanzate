import { Title } from "@/features/layout/components"
import { MyOrdersContainer, OrdersSkeleton } from "@/features/store-orders/components"
import { Suspense } from "react"

async function MyOrdersPage() {
    return (
        <section className="p-4 grow flex flex-col pb-8">
            <Title
                title="My orders"
                breadcrumbs={[
                    { label: "Account", href: "/account" },
                    { label: "My orders", href: `/my-orders` }
                ]}
                homePath={`/`}
            />
            
            <div className="mt-6">
                <Suspense fallback={<OrdersSkeleton />}>
                    <MyOrdersContainer />
                </Suspense>
            </div>
        </section>
    )
}

export default MyOrdersPage