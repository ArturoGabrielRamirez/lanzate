import { getTranslations } from "next-intl/server"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getOrdersFromStoreAction } from "@/features/orders/actions/get-orders-from-store.action"
import { OrdersTable } from "@/features/orders/components/orders-table"
import { OrdersTabProps } from "@/features/stores/types"

async function OrdersTab({ slug }: OrdersTabProps) {

    const t = await getTranslations("store.orders-tab")

    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage || t("error-loading-user"))
    }

    const { payload: orders, hasError, message } = await getOrdersFromStoreAction(slug)

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