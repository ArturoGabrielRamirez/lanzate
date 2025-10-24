import { Box, Calendar, Check, MapPin, Package, ShoppingCart, Truck, User } from "lucide-react"

import { OrderDetailsAccordionsProps } from "@/features/orders/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { AlertTitle } from "@/features/shadcn/components/ui/alert"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { cn, formatDate } from "@/lib/utils"

function OrderDetailsAccordions({ order }: OrderDetailsAccordionsProps) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    return (
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <AlertTitle className="flex items-center gap-2 text-lg font-medium">
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
                    <AlertTitle className="flex items-center gap-2 text-lg font-medium">
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
                    <AlertTitle className="flex items-center gap-2 text-lg font-medium">
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
                            order.payment?.status === "PAID" && "bg-green-500 text-white"
                        )}>
                            {order.payment?.status === "PAID" && <Check className="w-4 h-4" />}
                            {order.payment?.status}
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
                        <span className="text-sm md:text-base font-medium">{formatDate(order.created_at)}</span>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>
                    <AlertTitle className="flex items-center gap-2 text-lg font-medium">
                        <Calendar className="size-4" />
                        Order Timeline
                    </AlertTitle>
                </AccordionTrigger>
                <AccordionContent>
                    coming soon
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
export { OrderDetailsAccordions }