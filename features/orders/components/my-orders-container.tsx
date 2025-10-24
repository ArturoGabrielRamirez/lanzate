import { Package } from "lucide-react"

import { getUserInfo } from "@/features/layout/actions"
import { getUserOrdersAction } from "@/features/orders/actions/get-user-orders.action"
import { OrderCard } from "@/features/orders/components/order-card"
import { OrderWithDetails } from "@/features/orders/types"

async function MyOrdersContainer() {
    const { payload: user, hasError: userError } = await getUserInfo()

    if (userError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">
                    Please log in to view your orders.
                </p>
            </div>
        )
    }

    const { payload: orders = [], hasError: ordersError } = await getUserOrdersAction(user.id)

    if (ordersError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Error Loading Orders</h3>
                <p className="text-muted-foreground">
                    There was an error loading your orders. Please try again later.
                </p>
            </div>
        )
    }

    if (orders?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                    You haven&apos;t placed any orders yet.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {orders?.map((order: OrderWithDetails) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    )
}

export { MyOrdersContainer }