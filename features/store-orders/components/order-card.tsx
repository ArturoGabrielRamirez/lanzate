import { Order, OrderItem, Product, Store, Branch } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Store as StoreIcon, Eye } from "lucide-react"
import OrderItemComponent from "./order-item"
import Link from "next/link"

type OrderWithDetails = Order & {
    items: (OrderItem & {
        product: Product
    })[]
    store: Store
    branch: Branch
}

type Props = {
    order: OrderWithDetails
}

function OrderCard({ order }: Props) {
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
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
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
                <div className="space-y-3">
                    {order.items.map((item) => (
                        <OrderItemComponent key={item.id} item={item} />
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-muted">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold text-lg">
                            ${order.total_price.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Items: {order.total_quantity}</span>
                        <span>
                            {order.is_paid ? 'Paid' : 'Pending Payment'}
                        </span>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/my-orders/${order.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default OrderCard 