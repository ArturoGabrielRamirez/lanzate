import { Order } from "@/prisma/generated/prisma"

export type ChangeOrderStatusButtonProps = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

export type CancelOrderButtonProps = {
    order: Order
    slug: string
    userId: number
    onComplete?: () => void
}

export type ChangeOrderStatusData = {
    newStatus: string
    confirmPayment: boolean
    confirmStockRestore: boolean
} 