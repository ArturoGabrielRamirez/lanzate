import { getOrdersFromStore } from "../../actions/getOrdersFromStore"
import OrdersTable from "../orders-table"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getTranslations } from "next-intl/server"

type Props = {
    slug: string
}

async function OrdersTab({ slug }: Props) {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()
    const t = await getTranslations("store.orders-tab")

    if (userError || !user) {
        return console.error(userMessage || t("error-loading-user"))
    }

    const { payload: orders, error, message } = await getOrdersFromStore(slug)

    if (error || !orders) {
        return console.log(message || t("error-loading-orders"))
    }

    return (
        <>
            <OrdersTable data={orders} slug={slug} userId={user.id} />
        </>
    )
}
export default OrdersTab