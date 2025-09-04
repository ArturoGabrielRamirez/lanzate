import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailPageProps } from "@/features/stores/types/order-detail-page-type"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import OrderSummaryStepsContainer from "@/features/orders/components/order-sumarry-steps-container"
import { Suspense } from "react"
import OrderSummarySkeleton from "@/features/orders/components/order-summary-skeleton"

async function OrderDetailPage({ params }: OrderDetailPageProps) {

    const { slug, id } = await params

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

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