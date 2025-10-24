import { MessageType, OrderTrackingStatus } from "@prisma/client"

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

