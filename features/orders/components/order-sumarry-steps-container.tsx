import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/ui/accordion"
import { AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getEmployeePermissions } from "@/features/stores/actions/getEmployeePermissions"
import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
import { cn } from "@/lib/utils"
import { Box, Calendar, Check, MapPin, Package, ShoppingCart, Truck, User } from "lucide-react"
import OrderTimeline from "./order-timeline"
import { RealtimeChat } from "@/components/realtime-chat"

type Props = {
    userId: number
    orderId: string
    storeSlug: string
}

const OrderSummaryStepsContainer = async ({ userId, orderId, storeSlug }: Props) => {
    const [
        { payload: order, error: orderError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getOrderDetails(orderId),
        getEmployeePermissions(userId, storeSlug)
    ])


    if (orderError || !order) {
        console.log(orderError)
        return <div>Error loading order details</div>
    }

    if (permissionsError || !employeePermissions) {
        console.log("Error loading employee permissions")
        return <div>Error loading employee permissions</div>
    }


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-8 w-full">
            <div className="flex flex-col gap-2 md:min-w-sm border p-4 rounded-md md:max-w-md w-full xl:max-w-full">
                <h3 className="text-2xl font-bold text-center flex items-center justify-center gap-2">Order #{order.id} {order.shipping_method === "PICKUP" ? <MapPin className="size-4 md:size-6" /> : <Truck className="size-4 md:size-6" />}</h3>
                <p className="text-sm text-muted-foreground text-center">
                    {Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(order.created_at)}
                </p>
                <OrderTimeline order={order} />
            </div>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <AlertTitle className="flex items-center gap-2">
                            <User className="size-4" />
                            Customer Info
                        </AlertTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-muted-foreground">Name</span>
                                <span className="text-sm md:text-base font-medium">{order.customer_name || "Name not available"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-muted-foreground">Email</span>
                                <span className="text-sm md:text-base font-medium">{order.customer_email || "Email not available"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-muted-foreground">Phone</span>
                                <span className="text-sm md:text-base font-medium">{order.customer_phone || "Phone not available"}</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        <AlertTitle className="flex items-center gap-2">
                            <Box className="size-4" />
                            Order Items
                        </AlertTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-md bg-secondary">
                                            {item.product.image ? (
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <Package className="w-6 h-6 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-medium">{item.product.name}</h5>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} × {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                        <AlertTitle className="flex items-center gap-2">
                            <ShoppingCart className="size-4" />
                            Order Details
                        </AlertTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-muted-foreground">Order ID</span>
                            <span className="text-sm md:text-base font-medium">#{order.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-muted-foreground">Total Amount</span>
                            <span className="text-lg md:text-xl font-bold">{formatCurrency(order.total_price)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-muted-foreground">Total Items</span>
                            <span className="text-sm md:text-base font-medium">{order.total_quantity} {order.total_quantity === 1 ? "item" : "items"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-muted-foreground">Payment Status</span>
                            <Badge variant={"outline"} className={cn(
                                "text-xs md:text-sm",
                                order.payment.status === "PAID" && "bg-green-500 text-white"
                            )}>
                                {order.payment.status === "PAID" && <Check className="w-4 h-4" />}
                                {order.payment.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-muted-foreground">Shipping Method</span>
                            {order.shipping_method === "PICKUP" ? (
                                <Badge variant="outline">
                                    <MapPin className="w-4 h-4" />
                                    {order.shipping_method}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs md:text-sm">
                                    <Truck className="w-4 h-4" />
                                    {order.shipping_method}
                                </Badge>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-muted-foreground">Order Date</span>
                            <span className="text-sm md:text-base font-medium">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(order.created_at)}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>
                        <AlertTitle className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            Order Timeline
                        </AlertTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        coming soon
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <RealtimeChat roomName={`order-${order.id}`} username={"Store"} />
        </div>
    )
}
export default OrderSummaryStepsContainer