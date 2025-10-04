import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Timer } from "lucide-react"
import { Order, OrderTracking, OrderItem, Product, OrderPayment, Store } from "@prisma/client"
import { Button } from "@/components/ui/button"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store }
}

const OrderDetailsArrival = ({ order }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <h3 className="text-xl font-medium">
                        Order {order.shipping_method === "DELIVERY" ? "Arrival" : "Pickup"}
                    </h3>
                    <Timer />
                </CardTitle>
            </CardHeader>
            <CardContent className="grow">
                <p className="text-muted-foreground">
                    {order.shipping_method === "DELIVERY" ? "Your order will arrive at your address in the next 24 hours." : "Your order will be ready for pickup in the next 24 hours."}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button className="w-full md:w-auto">
                    <MapPin className="size-4" />
                    View on map
                </Button>
            </CardFooter>
        </Card>
    )
}
export default OrderDetailsArrival