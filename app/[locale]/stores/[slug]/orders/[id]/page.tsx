import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import OrderSummaryStepsContainer from "@/features/orders/components/order-sumarry-steps-container"
import OrderSummarySkeleton from "@/features/orders/components/order-summary-skeleton"
import { OrderDetailPageProps } from "@/features/stores/types"

async function OrderDetailPage({ params }: OrderDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    return (
        <Card className="!gap-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/orders`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    Order Details
                </CardTitle>
            </CardHeader>
            <CardContent className="flex grow gap-4 flex-col md:flex-row">
                <Suspense fallback={<OrderSummarySkeleton />}>
                    <OrderSummaryStepsContainer userId={user.id} orderId={id} storeSlug={slug} />
                </Suspense>
            </CardContent>
        </Card>
    )
}

export default OrderDetailPage 