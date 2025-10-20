import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/features/shadcn/components/ui/card"
import OpenChatButton from "@/features/orders/components/open-chat-button"
import { cn } from "@/lib/utils"
import { Order, OrderTracking, OrderItem, Product, OrderPayment, Store, Branch } from "@prisma/client"
import { MapPin, Phone, StoreIcon } from "lucide-react"

type Props = {
    order: Order & { tracking: OrderTracking | null, items: (OrderItem & { product: Product })[] } & { payment: OrderPayment } & { store: Store } & { branch: Branch }
}

const OrderDetailsStore = ({ order }: Props) => {

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                    <h3 className="text-xl font-medium">
                        Store
                    </h3>
                    <StoreIcon />
                </CardTitle>
            </CardHeader>
            <CardContent className="grow">
                <p className="text-muted-foreground mb-4">Need help? Contact the store.</p>
                <div className="flex items-center gap-2">
                    <Phone className="size-4" />
                    <p className="text-muted-foreground">{order.branch.phone || "No phone available"}</p>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    <p className="text-muted-foreground">{order.branch.address || "No address available"}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <div className={cn(order.status === "COMPLETED" && "opacity-50 pointer-events-none cursor-not-allowed")}>
                    <OpenChatButton
                        roomId={String(order.id)}
                        username="Customer"
                        messageType="CUSTOMER_TO_STORE"
                    />
                </div>
            </CardFooter>
        </Card>
    )
}
export default OrderDetailsStore