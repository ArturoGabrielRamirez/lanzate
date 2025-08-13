import { getUserInfo } from "@/features/layout/actions"
import { getOrderByIdAction } from "../actions/getOrderByIdAction"
import { Package, AlertCircle } from "lucide-react"
import { notFound } from "next/navigation"
import CustomerOrderTracking from "./customer-order-tracking"

type Props = {
    orderId: string
}

async function OrderDetailsContainer({ orderId }: Props) {
    const { payload: user, error: userError } = await getUserInfo()

    if (userError || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
                <p className="text-muted-foreground">
                    Please log in to view order details.
                </p>
            </div>
        )
    }

    const { payload: order, error: orderError } = await getOrderByIdAction(parseInt(orderId), user.id)

    if (orderError || !order) {
        notFound()
    }

    return (
        <div className="flex gap-6 flex-col md:flex-row">
            <div className="flex-1">
                <CustomerOrderTracking order={order} />
            </div>
            
            <div className="w-80 flex-shrink-0">
                <div className="sticky top-6">
                    <h4 className="font-medium mb-3">Need Help?</h4>
                    <div className="bg-muted/30 border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-muted-foreground">
                                <p className="font-medium mb-2">Contact Information:</p>
                                <ul className="space-y-1">
                                    <li>• Store: {order.store.name}</li>
                                    <li>• Branch: {order.branch.name}</li>
                                    <li>• Order ID: #{order.id}</li>
                                </ul>
                                <p className="mt-2">
                                    If you have any questions about your order, please contact the store directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsContainer 