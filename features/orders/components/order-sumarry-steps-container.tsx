/* import { getUserStoreActivities } from "@/features/dashboard/actions/getUserStoreActivities" */
import { Accordion, AccordionTrigger, AccordionItem, AccordionContent } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { getEmployeePermissions } from "@/features/stores/actions/getEmployeePermissions"
import { getOrderDetails } from "@/features/stores/actions/getOrderDetails"
import { cn } from "@/lib/utils"
import { AlertCircle, Box, Calendar, ShoppingCart, User } from "lucide-react"
/* import OrderSummarySteps from "./order-summary-steps" */

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

    const alertClasses = cn(
        order.status === "PENDING" && "border-yellow-500 text-yellow-500",
        order.status === "PROCESSING" && "border-blue-500 text-blue-500",
        order.status === "READY" && "border-green-500 text-green-500",
        order.status === "SHIPPED" && "border-purple-500 text-purple-500",
        order.status === "DELIVERED" && "border-red-500 text-red-500",
        order.status === "CANCELLED" && "border-red-500 text-red-500",
        order.status === "COMPLETED" && "border-green-500 text-green-500",
    )

    const statusTexts = {
        PENDING: "This order is currently pending and should be confirmed to continue with the next step.",
        PROCESSING: "This order is currently being processed and should be confirmed to continue with the next step.",
        READY: "This order is currently ready and the customer should have been notified.",
        SHIPPED: "This order is currently being shipped and the customer should have been notified.",
        DELIVERED: "This order has been delivered to the customer.",
        CANCELLED: "This order has been cancelled.",
        COMPLETED: "This order has been completed.",
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 w-full">
            <div className="flex flex-col gap-2 md:min-w-sm border p-4 rounded-md md:max-w-sm w-full">
                <h3 className="text-2xl font-bold text-center">Order #{order.id}</h3>
                <p className="text-sm text-muted-foreground text-center">
                    {Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(order.created_at)}
                </p>
                <Alert className={cn(alertClasses, "not-hover:animate-pulse text-lg lg:text-xl mx-auto my-4 w-full")}>
                    <AlertTitle className="flex items-center gap-2">
                        <AlertCircle className="size-4 lg:size-6" />
                        {order.status}
                    </AlertTitle>
                    <AlertDescription className="text-balance">
                        {statusTexts[order.status as keyof typeof statusTexts]}
                    </AlertDescription>
                </Alert>

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
                        <Badge variant="outline" className={cn(alertClasses, "animate-pulse")}>
                            {order.status}
                        </Badge>
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
                        <Alert className={cn(alertClasses)}>
                            <AlertTitle className="flex items-center gap-2">
                                <AlertCircle className="size-4" />
                                Order Details
                            </AlertTitle>
                        </Alert>
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
                        <Alert className={cn(alertClasses)}>
                            <AlertTitle className="flex items-center gap-2">
                                <AlertCircle className="size-4" />
                                Customer Info
                            </AlertTitle>
                        </Alert>
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
                        <Alert className={cn(alertClasses)}>
                            <AlertTitle className="flex items-center gap-2">
                                <AlertCircle className="size-4" />
                                Customer Info
                            </AlertTitle>
                        </Alert>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            {/* <OrderSummarySteps order={order} employeePermissions={employeePermissions} /> */}
        </div>
    )
}
export default OrderSummaryStepsContainer