import { getOrdersFromStore } from "../../actions/getOrdersFromStore"
import OrdersTable from "../orders-table"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"

type Props = {
    slug: string
}

async function OrdersTab({ slug }: Props) {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: orders, error, message } = await getOrdersFromStore(slug)

    if (error || !orders) {
        return console.log(message)
    }

    return (
        <>
            <OrdersTable data={orders} slug={slug} userId={user.id} />
        </>
    )
}
export default OrdersTab