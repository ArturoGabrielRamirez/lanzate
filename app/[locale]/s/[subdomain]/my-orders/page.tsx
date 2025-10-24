import { Suspense } from "react"

import { Title } from "@/features/layout/components"
import {PageContainer} from "@/features/layout/components/page-container"
import { MyOrdersContainer, OrdersSkeleton } from "@/features/store-orders/components"

async function MyOrdersPage() {
    return (
        <PageContainer>
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
        </PageContainer>
    )
}

export default MyOrdersPage