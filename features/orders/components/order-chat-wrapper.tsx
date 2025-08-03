"use client"

import { useOptimistic } from "react"
import { OrderChatContext, type User, type MessageWithSender } from "./order-chat-context"
import OrderChatMessages from "./order-chat-messages"
import OrderChatInput from "./order-chat-input"

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

export default OrderChatWrapper 