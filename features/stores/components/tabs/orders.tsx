import { getOrdersFromStore } from "../../actions/getOrdersFromStore"
import OrdersTable from "../orders-table"
type Props = {
    slug: string
}

async function OrdersTab({ slug }: Props) {

    const { payload: orders, error, message } = await getOrdersFromStore(slug)
    console.log("🚀 ~ OrdersTab ~ orders:", orders)

    if (error || !orders) {
        return console.log(message)
    }

    return (
        <div>
            <OrdersTable data={orders} />
        </div>
    )
}
export default OrdersTab