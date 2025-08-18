
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderDetailPageProps } from "@/features/stores/types/order-detail-page-type"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
/* import { getTranslations } from "next-intl/server"
import OrderChat from "@/features/orders/components/order-chat"
import OrderSummarySteps from "@/features/orders/components/order-summary-steps" */
import OrderSummaryStepsContainer from "@/features/orders/components/order-sumarry-steps-container"
import { Suspense } from "react"
import OrderSummarySkeleton from "@/features/orders/components/order-summary-skeleton"

async function OrderDetailPage({ params }: OrderDetailPageProps) {

    const { slug, id } = await params

    // Get user info first
    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    // Get order details and employee permissions
    /* const [
        { payload: order, error: orderError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getOrderDetails(id),
        getEmployeePermissions(user.id, slug)
    ])

    if (orderError || !order) {
        return console.log(orderError)
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    } */

    // const t = await getTranslations("store")

    return (
        <Card className="!gap-0">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/orders`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    {/* {t("orders.order-details")}#{order.id} */}
                    Order Details
                </CardTitle>
            </CardHeader>
            <CardContent className="flex grow gap-4 flex-col md:flex-row">
                <Suspense fallback={<OrderSummarySkeleton />}>
                    <OrderSummaryStepsContainer userId={user.id} orderId={id} storeSlug={slug} />
                </Suspense>
                {/* <Card className="w-full">
                    <CardContent className="flex flex-col gap-4 grow"> */}
                {/* <OrderSummarySteps order={order} employeePermissions={employeePermissions} /> */}
                {/* </CardContent>
                </Card> */}
                {/* <OrderChat storeSlug={slug} orderId={id} /> */}
            </CardContent>
        </Card>
    )
}

export default OrderDetailPage 