import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Truck, Store as StoreIcon } from "lucide-react"
import OrderTimelineIcons from "@/features/orders/components/order-timeline-icons"
import { Order, OrderItem, OrderPayment, OrderTracking, Product, Store } from "@prisma/client"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

const OrderDetailsStatus = ({ order }: Props) => {

    const orderDescriptions = {
        PROCESSING: "Be patient, your order is being processed.",
        READY: "Be patient, your order was confirmed and is being prepared.",
        COMPLETED: "Enjoy your purchase!",
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    <h3 className="flex items-center gap-2 text-lg font-medium">
                        <span>Order #{order.id} - </span>
                        {order.shipping_method === "DELIVERY" ? <Truck className="size-4" /> : <MapPin className="size-4" />}
                    </h3>
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
                <Progress value={50} className="bg-green-600/10" indicatorClassName="bg-green-600" />
            </CardFooter>
        </Card>
    )
}
export default OrderDetailsStatus