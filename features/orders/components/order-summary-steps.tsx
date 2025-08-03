"use client"
import { InteractiveStepper, InteractiveStepperContent, InteractiveStepperDescription, InteractiveStepperIndicator, InteractiveStepperItem, InteractiveStepperSeparator, InteractiveStepperTitle, InteractiveStepperTrigger } from "@/components/expansion/interactive-stepper"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User, Mail, Phone, Package, Save } from "lucide-react"
import { useState, useTransition } from "react"
import { StepNavigation } from "@/features/checkout/components/step-navigation"
import { updateOrderStatusAction } from "../actions/updateOrderStatusAction"
import { toast } from "sonner"

type OrderItemWithProduct = {
    id: number
    quantity: number
    price: number
    product: {
        id: number
        name: string
        image: string | null
    }
}

type Order = {
    id: number
    created_at: Date
    shipping_method: "pickup" | "delivery"
    status: "PENDING" | "PROCESSING" | "READY" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "COMPLETED"
    customer_name: string | null
    customer_email: string | null
    customer_phone: string | null
    total_price: number
    total_quantity: number
    branch: {
        name: string
        address: string
    } | null
    items: OrderItemWithProduct[]
    payment: {
        amount: number
        status: "PENDING" | "PAID"
    }
    created_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
    updated_by_employee?: {
        user?: {
            first_name: string | null
            last_name: string | null
            email: string
        }
    } | null
}

type Props = {
    order: Order
}

function OrderSummarySteps({ order }: Props) {
    const [selectedStatus, setSelectedStatus] = useState(order.status)
    const [isPending, startTransition] = useTransition()
    console.log("🚀 ~ OrderSummarySteps ~ order.status:", order.status)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const t = (key: string) => {
        const translations: Record<string, string> = {
            "branches.store-pickup": "Store Pickup",
            "branches.delivery": "Delivery",
            "orders.item": "item",
            "orders.items": "items",
            "orders.quantity": "Quantity: ",
            "orders.amount": "Amount",
            "orders.status": "Status",
            "orders.created-by": "Created by",
            "orders.last-updated-by": "Last updated by"
        }
        return translations[key] || key
    }

    const isPickup = order.shipping_method === "pickup"
    const isCompleted = order.status === "COMPLETED"
    const thirdStepTitle = isPickup ? "Ready for Pickup" : "Shipped"
    const thirdStepDescription = isPickup ? "Your order is ready for pickup" : "Your order is on the way"

    // Define status options based on order type
    const statusOptions = isPickup 
        ? [
            { value: "PROCESSING", label: "Processing" },
            { value: "READY", label: "Ready" },
            { value: "CANCELLED", label: "Cancelled" }
          ]
        : [
            { value: "PROCESSING", label: "Processing" },
            { value: "READY", label: "Ready" },
            { value: "DELIVERED", label: "Delivered" },
            { value: "CANCELLED", label: "Cancelled" }
          ]

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value as Order['status'])
    }

    const handleSaveStatus = () => {
        if (selectedStatus === order.status) {
            toast.info("Status is already the same")
            return
        }

        startTransition(async () => {
            try {
                const result = await updateOrderStatusAction({
                    orderId: order.id.toString(),
                    newStatus: selectedStatus
                })

                if (result.error) {
                    toast.error(result.message)
                } else {
                    toast.success("Order status updated successfully")
                    // Optionally refresh the page or update the order prop
                    window.location.reload()
                }
            } catch (error) {
                console.error("Error updating order status:", error)
                toast.error("Failed to update order status")
            }
        })
    }

    const orderDetailsContent = (
        <div className="space-y-6">
            <div className="flex items-center gap-2 justify-between">
                <p className="text-sm">{formatDate(order.created_at)}</p>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm uppercase border-2">
                        {order.shipping_method === "pickup" ? t("branches.store-pickup") : t("branches.delivery")}
                    </Badge>
                    <Badge
                        className={cn(
                            "bg-transparent text-sm",
                            order.status === "PENDING" && "border-yellow-500 text-yellow-500",
                            order.status === "PROCESSING" && "border-orange-500 text-orange-500",
                            order.status === "READY" && "border-blue-500 text-blue-500",
                            order.status === "SHIPPED" && "border-violet-500 text-violet-500",
                            order.status === "DELIVERED" && "border-green-500 text-green-500",
                            order.status === "CANCELLED" && "border-red-500 text-red-500",
                            order.status === "COMPLETED" && "border-green-500 text-green-500"
                        )}
                    >
                        {order.status}
                    </Badge>
                </div>
            </div>
            <div className="grow">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                    <User className="size-4" />
                    {order.customer_name || 'No name provided'}
                </h3>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />
                    {order.customer_email || "No email provided"}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />
                    {order.customer_phone || "No phone provided"}
                </p>
            </div>
            <p className="text-lg font-bold">{formatCurrency(order.total_price)}</p>
            <p className="text-xs text-muted-foreground">{order.total_quantity} {order.total_quantity === 1 ? t("orders.item") : t("orders.items")}</p>

            {order.branch && (
                <div className="">
                    <p className="text-sm font-medium">{order.branch.name}</p>
                    <p className="text-xs text-muted-foreground">{order.branch.address}</p>
                </div>
            )}
            {order.items.map((item: OrderItemWithProduct) => (
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
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                {t("orders.quantity")}{item.quantity} × {formatCurrency(item.price)}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                    </div>
                </div>
            ))}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <p className="text-sm text-muted-foreground">{t("orders.amount")}</p>
                    <p className="font-medium">{formatCurrency(order.payment.amount)}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{t("orders.status")}</p>
                    <Badge variant={order.payment.status === "PAID" ? "default" : "secondary"}>
                        {order.payment.status}
                    </Badge>
                </div>
            </div>
            {order.created_by_employee && (
                <div>
                    <p className="text-sm text-muted-foreground">{t("orders.created-by")}</p>
                    <p className="font-medium">
                        {order.created_by_employee.user?.first_name
                            ? `${order.created_by_employee.user.first_name} ${order.created_by_employee.user.last_name || ''}`
                            : order.created_by_employee.user?.email
                        }
                    </p>
                </div>
            )}
            {order.updated_by_employee && (
                <div>
                    <p className="text-sm text-muted-foreground">{t("orders.last-updated-by")}</p>
                    <p className="font-medium">
                        {order.updated_by_employee.user?.first_name
                            ? `${order.updated_by_employee.user.first_name} ${order.updated_by_employee.user.last_name || ''}`
                            : order.updated_by_employee.user?.email
                        }
                    </p>
                </div>
            )}
        </div>
    )

    if (isCompleted) {
        return (
            <InteractiveStepper orientation="horizontal">
                <InteractiveStepperItem completed>
                    <InteractiveStepperTrigger>
                        <InteractiveStepperIndicator />
                        <div>
                            <InteractiveStepperTitle>Order Completed</InteractiveStepperTitle>
                            <InteractiveStepperDescription>
                                This order has been completed successfully
                            </InteractiveStepperDescription>
                        </div>
                    </InteractiveStepperTrigger>
                </InteractiveStepperItem>
                <InteractiveStepperContent step={1}>
                    {orderDetailsContent}
                </InteractiveStepperContent>
            </InteractiveStepper>
        )
    }

    return (
        <InteractiveStepper orientation="horizontal">
            <InteractiveStepperItem completed>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
                        <InteractiveStepperDescription>
                            Your order has been placed successfully
                        </InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
                        <InteractiveStepperDescription>
                            We are preparing your order
                        </InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperItem>
                <InteractiveStepperTrigger>
                    <InteractiveStepperIndicator />
                    <div>
                        <InteractiveStepperTitle>{thirdStepTitle}</InteractiveStepperTitle>
                        <InteractiveStepperDescription>{thirdStepDescription}</InteractiveStepperDescription>
                    </div>
                </InteractiveStepperTrigger>
                <InteractiveStepperSeparator />
            </InteractiveStepperItem>
            <InteractiveStepperContent step={1}>
                {orderDetailsContent}
                <StepNavigation />
            </InteractiveStepperContent>
            <InteractiveStepperContent step={2}>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Update Order Status</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Change the current status of this order
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Order Status</label>
                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button 
                            onClick={handleSaveStatus}
                            disabled={isPending || selectedStatus === order.status}
                            className="w-full"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isPending ? "Saving..." : "Save Status"}
                        </Button>
                    </div>
                    <StepNavigation />
                </div>
            </InteractiveStepperContent>
        </InteractiveStepper>
    )
}
export default OrderSummarySteps