/* import { getUserStoreActivities } from "@/features/dashboard/actions/getUserStoreActivities" */
import { getEmployeePermissions } from "@/features/stores/actions/getEmployeePermissions"
import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
/* import OrderSummarySteps from "./order-summary-steps" */

type Props = {
    userId: number
    orderId: string
    storeSlug: string
}

const OrderSummaryStepsContainer = async ({ userId, orderId, storeSlug }: Props) => {
    const [
        { payload: order, error: orderError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getOrderDetails(orderId),
        getEmployeePermissions(userId, storeSlug)
    ])

    if (orderError || !order) {
        console.log(orderError)
        return <div>Error loading order details</div>
    }

    if (permissionsError || !employeePermissions) {
        console.log("Error loading employee permissions")
        return <div>Error loading employee permissions</div>
    }

    return (
        <>
            {/* <OrderSummarySteps order={order} employeePermissions={employeePermissions} /> */}
        </>
    )
}
export default OrderSummaryStepsContainer