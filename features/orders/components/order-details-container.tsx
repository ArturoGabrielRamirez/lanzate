import { Package } from "lucide-react"
import { notFound } from "next/navigation"

import { getUserInfo } from "@/features/layout/actions"
import { getOrderByIdAction } from "@/features/orders/actions/get-order-by-id.action"
import { CustomerOrderTracking } from "@/features/orders/components/customer-order-tracking"

type Props = {
    orderId: string
}

async function OrderDetailsContainer({ orderId }: Props) {
    const { payload: user, hasError: userError } = await getUserInfo()

    if (userError || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">
                    Please log in to view order details.
                </p>
            </div>
        )
    }

    const { payload: order, hasError: orderError } = await getOrderByIdAction(parseInt(orderId), user.id)

    if (orderError || !order) {
        notFound()
    }

    return (
        <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex-1">
                <CustomerOrderTracking order={order} />
            </div>
        </div>
    )
}

export { OrderDetailsContainer }