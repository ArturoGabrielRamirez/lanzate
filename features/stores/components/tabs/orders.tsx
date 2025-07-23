import { getOrdersFromStore } from "../../actions/getOrdersFromStore"
import OrdersTable from "../orders-table"
type Props = {
    slug: string
}

async function OrdersTab({ slug }: Props) {

    const { payload: orders, error, message } = await getOrdersFromStore(slug)

    if (error || !orders) {
        return console.log(message)
    }

    return (
        <>
            <OrdersTable data={orders} slug={slug} />
        </>
    )
}
export default OrdersTab