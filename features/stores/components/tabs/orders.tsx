import { getOrdersFromStore } from "../../actions/getOrdersFromStore"

type Props = {
    slug: string
}

async function OrdersTab({ slug }: Props) {

    const { payload: orders, error, message } = await getOrdersFromStore(slug)

    if (error || !orders) {
        return console.log(message)
    }

    return (
        <div>
            {orders.map((order) => (
                <div key={order.id}>{order.id}</div>
            ))}
        </div>
    )
}
export default OrdersTab