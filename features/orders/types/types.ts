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

