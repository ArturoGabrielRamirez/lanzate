import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { MapPin, Truck, Store as StoreIcon } from "lucide-react"
import OrderTimelineIcons from "@/features/orders/components/order-timeline-icons"
import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"
import { Progress } from "@/features/shadcn/components/ui/progress"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { useMemo } from "react"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

const OrderDetailsStatus = ({ order }: Props) => {

    const orderDescriptions = {
        PROCESSING: "Be patient, your order is being processed.",
        READY: "Be patient, your order was confirmed and is being prepared.",
        COMPLETED: "Enjoy your purchase!",
    }

    const progress = useMemo(() => {
        if (order.status === "PROCESSING") {
            return 10
        }
        if (order.tracking && order.tracking.tracking_status === "PREPARING_ORDER") {
            return 30
        }
        if (order.tracking && order.tracking.tracking_status === "WAITING_FOR_DELIVERY") {
            return 40
        }
        if (order.tracking && order.tracking.tracking_status === "ON_THE_WAY") {
            return 60
        }
        if (order.tracking && order.tracking.tracking_status === "WAITING_FOR_PICKUP") {
            return 80
        }
        if (order.status === "COMPLETED") {
            return 100
        }
        if (order.status === "READY") {
            return 25
        }
        return 0
    }, [order.status, order.tracking])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <h3 className="text-xl font-medium">
                        Order #{order.id}
                    </h3>
                    {order.shipping_method === "DELIVERY" ? <Truck className="size-4" /> : <MapPin className="size-4" />}
                </CardTitle>
                <CardDescription>
                    <p className="text-base">{orderDescriptions[order.status as keyof typeof orderDescriptions]}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OrderTimelineIcons order={order} />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                    <Badge variant="outline">
                        <StoreIcon />
                        {order.store.name}
                    </Badge>
                    <div className="flex items-center justify-between flex-1">
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                        <div className="h-1 w-1 bg-green-600/50 rounded-full animate-pulse" />
                    </div>
                    <Badge variant="outline">
                        {order.shipping_method === "DELIVERY" ? (
                            <>
                                <Truck />
                                {order.address_one}
                            </>
                        ) : (
                            <>
                                <MapPin />
                                at store
                            </>
                        )}
                    </Badge>
                </div>
                <Progress value={progress} className="bg-green-600/10" indicatorClassName="bg-green-600" />
            </CardFooter>
        </Card>
    )
}
export default OrderDetailsStatus