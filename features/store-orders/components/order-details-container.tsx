import { getUserInfo } from "@/features/layout/actions"
import { getOrderByIdAction } from "../actions/getOrderByIdAction"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Store as StoreIcon, Package } from "lucide-react"
import OrderItemComponent from "./order-item"
import { OrderItem, Product } from "@prisma/client"
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

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800'
            case 'READY':
                return 'bg-green-100 text-green-800'
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800'
            case 'DELIVERED':
                return 'bg-green-100 text-green-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <CustomerOrderTracking order={order} />
        </div>
    )
}

export default OrderDetailsContainer 