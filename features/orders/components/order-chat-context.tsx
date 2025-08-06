"use client"

import { createContext, useContext } from "react"
import { OrderMessage } from "@prisma/client"

type User = {
    id: number
    first_name?: string | null
    last_name?: string | null
    email: string
    avatar?: string | null
}

type MessageWithSender = OrderMessage & {
    sender: User
}

type OrderChatContextType = {
    addOptimisticMessage: (message: MessageWithSender) => void
}

const OrderChatContext = createContext<OrderChatContextType | undefined>(undefined)

export function useOrderChat() {
    const context = useContext(OrderChatContext)
    if (!context) {
        throw new Error("useOrderChat must be used within OrderChatProvider")
    }
    return context
}

export { OrderChatContext }
export type { User, MessageWithSender } 