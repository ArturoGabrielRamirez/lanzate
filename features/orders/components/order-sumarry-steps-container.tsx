import { getEmployeePermissions } from "@/features/employees/actions/get-employee-permisions.action"
import { getOrderDetails } from "@/features/orders/actions/get-order-details.action"
import { formatDate } from "@/lib/utils"
import { MapPin, Truck } from "lucide-react"
import OrderTimeline from "./order-timeline"
import OrderDetailsAccordions from "./order-details-accordions"


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
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-8 w-full">
            <div className="flex flex-col gap-2 md:min-w-sm border p-4 rounded-md md:max-w-md w-full xl:max-w-full">
                <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2">Order #{order.id} {order.shipping_method === "PICKUP" ? <MapPin className="size-4 md:size-6" /> : <Truck className="size-4 md:size-6" />}</h3>
                <p className="text-sm text-muted-foreground text-center">
                    {formatDate(order.created_at)}
                </p>
                <OrderTimeline order={order} />
            </div>
            <OrderDetailsAccordions order={order} />
        </div>
    )
}
export default OrderSummaryStepsContainer