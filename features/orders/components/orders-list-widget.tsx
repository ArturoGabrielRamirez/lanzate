import { OrdersListEmpty } from "@/features/orders/components"
import { getOrdersFromStore } from "@/features/orders/actions/getOrdersFromStore"

async function OrdersListWidget({ slug }: { slug: string }) {

    const { payload: orders, hasError, message } = await getOrdersFromStore(slug, 5)

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