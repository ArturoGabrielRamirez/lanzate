import { MapPin, Truck } from "lucide-react"

import { getEmployeePermissionsAction } from "@/features/employees/actions/get-employee-permisions.action"
import { getOrderDetailsAction } from "@/features/orders/actions"
/* import { OrderDetailsAccordions } from "@/features/orders/components/order-details-accordions"
import { OrderTimeline } from "@/features/orders/components/order-timeline" */
import { OrderSummaryStepsContainerProps } from "@/features/orders/types"
import { formatDate } from "@/lib/utils"


async function OrderSummaryStepsContainer({ userId, orderId, storeSlug }: OrderSummaryStepsContainerProps) {
    const [
        { payload: order, hasError: orderError },
        { payload: employeePermissions, hasError: permissionsError }
    ] = await Promise.all([
        getOrderDetailsAction(orderId),
        getEmployeePermissionsAction(userId, storeSlug)
    ])


    if (orderError || !order) {
        console.log(orderError)
        return <div>Error al cargar los detalles del pedido</div>
    }

    if (permissionsError || !employeePermissions) {
        console.log("Error al cargar los permisos del empleado")
        return <div>Error al cargar los permisos del empleado</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-8 w-full">
            <div className="flex flex-col gap-2 md:min-w-sm border p-4 rounded-md md:max-w-md w-full xl:max-w-full">
                <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2">Pedido #{order.id} {order.shipping_method === "PICKUP" ? <MapPin className="size-4 md:size-6" /> : <Truck className="size-4 md:size-6" />}</h3>
                <p className="text-sm text-muted-foreground text-center">
                    {formatDate(order.created_at)}
                </p>
               {/*  <OrderTimeline order={order} /> */}
            </div>
           {/*  <OrderDetailsAccordions order={order} /> */}
        </div>
    )
}
export { OrderSummaryStepsContainer }