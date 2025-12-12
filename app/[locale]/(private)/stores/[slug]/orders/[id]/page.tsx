import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { OrderSummarySkeleton, OrderSummaryStepsContainer } from "@/features/orders/components"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
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
                    Detalles del pedido
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