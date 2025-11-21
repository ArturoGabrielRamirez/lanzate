import { MapPin, Truck, Store as StoreIcon } from "lucide-react"
import { useMemo } from "react"

import { OrderTimelineIcons } from "@/features/orders/components/order-timeline-icons"
import { OrderDetailsStatusProps } from "@/features/orders/types"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Progress } from "@/features/shadcn/components/ui/progress"

function OrderDetailsStatus({ order }: OrderDetailsStatusProps) {

    const orderDescriptions = {
        PROCESSING: "Tené paciencia, tu pedido está siendo procesado.",
        READY: "Tené paciencia, tu pedido fue confirmado y está siendo preparado.",
        COMPLETED: "¡Disfrutá tu compra!",
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
                                en la tienda
                            </>
                        )}
                    </Badge>
                </div>
                <Progress value={progress} className="bg-green-600/10" indicatorClassName="bg-green-600" />
            </CardFooter>
        </Card>
    )
}

export { OrderDetailsStatus }