import { Package } from "lucide-react"

import { getUserInfo } from "@/features/global/actions/get-user-info.action"
import { getUserOrdersAction } from "@/features/orders/actions/get-user-orders.action"
import { OrderCard } from "@/features/orders/components/order-card"
import { OrderWithDetails } from "@/features/orders/types"

async function MyOrdersContainer() {

    const { payload: user, hasError: userError } = await getUserInfo()

    if (userError || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Autenticación Requerida</h3>
                <p className="text-muted-foreground">
                    Por favor, iniciá sesión para ver tus pedidos.
                </p>
            </div>
        )
    }

    const { payload: orders = [], hasError: ordersError } = await getUserOrdersAction(user.id)

    if (ordersError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Error al Cargar Pedidos</h3>
                <p className="text-muted-foreground">
                    Hubo un error al cargar tus pedidos. Por favor, intentá nuevamente más tarde.
                </p>
            </div>
        )
    }

    if (orders?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No se Encontraron Pedidos</h3>
                <p className="text-muted-foreground">
                    Aún no realizaste ningún pedido.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {orders?.map((order: OrderWithDetails) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    )
}

export { MyOrdersContainer }