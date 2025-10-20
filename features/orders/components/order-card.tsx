import { Order, OrderItem, Product, Store, Branch } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
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
                    <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                    <div>
                        <p className="font-bold text-lg">
                            ${order.total_price.toFixed(2)}
                        </p>
                        <Badge className={getStatusColor(order.status)}>
                            {order.status}
                        </Badge>
                    </div>
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
            <CardFooter className="flex justify-end">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/my-orders/${order.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default OrderCard 