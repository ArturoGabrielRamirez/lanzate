import { MessageType, OrderTrackingStatus, Order, OrderItem, Product, OrderPayment, OrderTracking, Store, Branch, OrderMessage, OrderStatus } from "@prisma/client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export type ChangeOrderStatusData = {
    newStatus: string
    confirmPayment: boolean
    confirmStockRestore: boolean
}

export type UpdateOrderTrackingActionProps = {
    orderId: string
    newTrackingStatus: OrderTrackingStatus
}

export type InsertOrderMessageActionProps = {
    orderId: string
    message: string
    messageType?: MessageType
    fileUrl?: string
    fileName?: string
    fileSize?: number
    pathname: string
}

export type ConfirmOrderActionProps = {
    orderId: string
}

export type GetMessagesFromOrderActionProps = {
    storeSlug: string
    orderId: string
}

export type FinalizeOrderActionProps = {
    orderId: string
    shippingMethod: "PICKUP" | "DELIVERY"
}

export type ChangeOrderTrackingStatusActionProps = {
    orderId: number
    newStatus: {
        newStatus: OrderTrackingStatus
    }
}

// Data layer types
export type ChangeOrderTrackingStatusProps = {
    orderId: number
    newStatus: {
        newStatus: OrderTrackingStatus
    }
}

export type ConfirmOrderDataProps = {
    orderId: number
}

export type FinalizeOrderDataProps = {
    orderId: number
    shippingMethod: "PICKUP" | "DELIVERY"
}

export type GetMessagesFromOrderProps = {
    storeSlug: string
    orderId: string
}

export type UpdateOrderTrackingDataProps = {
    orderId: number
    newTrackingStatus: OrderTrackingStatus
}

export type UpdateCancelledOrderProps = {
    orderId: string
}

export type UpdateCompletedOrderProps = {
    orderId: string
}

export type UpdateDeliveredOrderProps = {
    orderId: string
}

export type InsertOrderMessageProps = {
    orderId: string
    message: string
    messageType?: MessageType
    fileUrl?: string
    fileName?: string
    fileSize?: number
}

// Shared UI types
export type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}

// Minimal UI shapes
export type ProductForUI = {
    id: number
    name: string
    image: string | null
    description?: string | null
    categories?: { id: number; name: string }[]
}

export type OrderItemWithProduct = {
    id: number
    quantity: number
    price: number
    product: ProductForUI
}

export type OrderWithTrackingItemsPayment = Order & {
    tracking: OrderTracking | null,
    items: OrderItemWithProduct[],
    payment: OrderPayment | null
}

export type OrderWithTrackingItemsPaymentStore = OrderWithTrackingItemsPayment & { store: { id: number; name: string; slug: string } }

export type OrderWithTrackingItemsPaymentStoreBranch = OrderWithTrackingItemsPaymentStore & { branch: { id: number; name: string; address: string | null; phone: string | null } }

export type OrderDetailsForUI = Order & {
    items: OrderItemWithProduct[]
    payment: { status: "PENDING" | "PAID" }
    customer_name?: string | null
    customer_email?: string | null
    customer_phone?: string | null
}

export type OrderMinimalStatus = {
    id: number
    shipping_method: "PICKUP" | "DELIVERY"
    status: OrderStatus
}

// Chat types moved from components
export type User = {
    id: number
    first_name?: string | null
    last_name?: string | null
    email: string
    avatar?: string | null
}

export type MessageWithSender = OrderMessage & { sender: User }

export type OrderChatContextType = {
    addOptimisticMessage: (message: MessageWithSender) => void
}

// Component Prop types
export type PickedUpOrderButtonProps = { order: OrderWithTrackingItemsPayment }
export type OrdersTableProps = { data: Order[]; slug: string; userId: number }
export type OrderTimelineProps = { order: OrderWithTrackingItemsPaymentStore }
export type OrderTimelineIconsProps = { order: OrderWithTrackingItemsPaymentStore }
export type OrderDetailsContainerProps = { orderId: string }
export type CustomerOrderTrackingProps = { order: OrderWithTrackingItemsPaymentStoreBranch }
export type OrderReadyButtonProps = { order: OrderWithTrackingItemsPayment }
export type OrderItemComponentProps = { item: OrderItemWithProduct }
export type OrderDetailsStoreProps = { order: OrderWithTrackingItemsPaymentStoreBranch }
export type OrderDetailsStepProps = { order: OrderDetailsForUI; showFullDetails?: boolean }
export type OrderDetailsStatusProps = { order: OrderWithTrackingItemsPaymentStore }
export type OrderDetailsArrivalProps = { order: OrderWithTrackingItemsPaymentStore }
export type OrderDetailsAccordionsProps = { order: OrderWithTrackingItemsPaymentStore }
export type OrderChatProps = { storeSlug: string; orderId: string }
export type OrderChatWrapperProps = { messages: MessageWithSender[]; currentUser: User | null; orderId: string }
export type OrderChatMessagesProps = { messages: MessageWithSender[]; currentUser: User | null }
export type CustomerInfoStepProps = { order: OrderDetailsForUI & { tracking?: { tracking_status: OrderTrackingStatus } | null; branch?: { name: string; address: string } | null; created_by_employee?: { user?: { first_name: string | null; last_name: string | null; email: string } } | null; updated_by_employee?: { user?: { first_name: string | null; last_name: string | null; email: string } } | null }; employeePermissions: EmployeePermissions }
export type OrderStatusStepProps = { order: OrderMinimalStatus; employeePermissions: EmployeePermissions }

// Additional component props/types
export type DynamicStepperTriggerProps = { config: StepperTriggerConfig }
export type StepperTriggerConfig = {
    title: string
    description: string
    completed?: boolean
    icon?: LucideIcon
    iconClassName?: string
    titleClassName?: string
    descriptionClassName?: string
    step?: number
}

export type ConfirmOrderButtonProps = {
    order: Order
    employeePermissions?: EmployeePermissions
    canUpdateOrders: boolean
    size?: "default" | "sm" | "lg"
}

export type ConfirmOrderButtonIconProps = { orderId: number }

export type ChangeOrderStatusButtonProps = {
    order: Order
    slug: string
    userId?: number
    onComplete?: () => void
}

export type CancelOrderButtonProps = {
    order: Order
    slug: string
    userId?: number
    onComplete?: () => void
    className?: string
    size?: "default" | "sm" | "lg"
    onlyIcon?: boolean
}

export type OpenChatButtonProps = {
    roomId: string
    onlyIcon?: boolean
    username?: string
    messageType?: "STORE_TO_CUSTOMER" | "CUSTOMER_TO_STORE"
}

export type ExportOrdersButtonProps = { data: Order[] }

export type FinalizeOrderButtonProps = { order: Order & { tracking: OrderTracking | null } }
export type OrderActionButtonsProps = { order: Order & { tracking: OrderTracking | null } }

export type OrderWithDetails = Order & {
    items: (OrderItem & { product: Product })[]
    store: Store
    branch: Branch
}
export type OrderCardProps = { order: OrderWithDetails }

export type OrderSummaryStepsProps = { order: OrderDetailsForUI; employeePermissions: EmployeePermissions }
export type OrderSummaryStepsContainerProps = { userId: number; orderId: string; storeSlug: string }
export type HorizontalPanelsProps = { leftPanel: ReactNode; rightPanel: ReactNode }
export type OrderChatInputProps = { orderId: string; user: User | null }

