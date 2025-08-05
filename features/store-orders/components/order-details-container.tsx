import { getUserInfo } from "@/features/layout/actions"
import { getOrderByIdAction } from "../actions/getOrderByIdAction"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Store as StoreIcon, Package, ArrowLeft } from "lucide-react"
import OrderItemComponent from "./order-item"
import Link from "next/link"
import { Order, OrderItem, Product, Store, Branch } from "@prisma/client"
import { notFound } from "next/navigation"

type OrderWithDetails = Order & {
    items: (OrderItem & {
        product: Product
    })[]
    store: Store
    branch: Branch
}

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
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                    <Link href="/my-orders">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                </Button>
            </div>

            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                            {order.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                            <StoreIcon className="w-4 h-4" />
                            {order.store.name}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.branch.name}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <h4 className="font-medium text-lg">Order Items</h4>
                            {order.items.map((item: OrderItem & { product: Product }) => (
                                <OrderItemComponent key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="pt-4 border-t border-muted">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total:</span>
                                <span className="font-bold text-xl">
                                    ${order.total_price.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                                <span>Items: {order.total_quantity}</span>
                                <span>
                                    {order.is_paid ? 'Paid' : 'Pending Payment'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OrderDetailsContainer 