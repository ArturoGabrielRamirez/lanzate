import { getTranslations } from "next-intl/server"

import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getOrdersFromStore } from "@/features/orders/actions/getOrdersFromStore"
import OrdersTable from "@/features/orders/components/orders-table"

type Props = {
    slug: string
}

async function OrdersTab({ slug }: Props) {

    const t = await getTranslations("store.orders-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage || t("error-loading-user"))
    }

    const { payload: orders, hasError, message } = await getOrdersFromStore(slug)

    if (hasError || !orders) {
        return console.log(message || t("error-loading-orders"))
    }

    return (
        <>
            <OrdersTable data={orders} slug={slug} userId={user.id} />
        </>
    )
}

export { OrdersTab }