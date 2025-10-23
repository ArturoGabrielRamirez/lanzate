import { OrdersListEmpty } from "@/features/orders/components"
import { getOrdersFromStoreAction } from "@/features/orders/actions/get-orders-from-store.action"

async function OrdersListWidget({ slug }: { slug: string }) {

    const { payload: orders, hasError, message } = await getOrdersFromStoreAction(slug, 5)

    if (hasError) {
        return <div>Error loading orders: {message || "Unknown error"}</div>
    }

    if (orders.length === 0) {
        return <OrdersListEmpty />
    }

    return (
        <div>

        </div>

    )
}

export { OrdersListWidget }