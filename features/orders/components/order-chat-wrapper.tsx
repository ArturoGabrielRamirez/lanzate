"use client"

import { useOptimistic } from "react"

import { OrderChatContext, type User, type MessageWithSender } from "@/features/orders/components/order-chat-context"
import { OrderChatInput } from "@/features/orders/components/order-chat-input"
import { OrderChatMessages } from "@/features/orders/components/order-chat-messages"

type Props = {
    messages: MessageWithSender[]
    currentUser: User | null
    orderId: string
}

function OrderChatWrapper({ messages, currentUser, orderId }: Props) {
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        messages,
        (currentMessages, newMessage: MessageWithSender) => {
            return [...currentMessages, newMessage]
        }
    )

    return (
        <OrderChatContext.Provider value={{ addOptimisticMessage }}>
            <div className="w-full h-full flex flex-col">
                <div className="flex-1 min-h-0">
                    <OrderChatMessages messages={optimisticMessages} currentUser={currentUser} />
                </div>
                <div className="border-t pt-4">
                    <OrderChatInput orderId={orderId} user={currentUser} />
                </div>
            </div>
        </OrderChatContext.Provider>
    )
}

export { OrderChatWrapper }