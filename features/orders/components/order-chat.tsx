import { Suspense } from "react"

import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getMessagesFromOrderAction } from "@/features/orders/actions/get-messages-from-order.action"
import { OrderChatWrapper } from "@/features/orders/components/order-chat-wrapper"
import { OrderChatProps } from "@/features/orders/types"

async function OrderChat({ storeSlug, orderId }: OrderChatProps) {
    const { payload: user } = await getUserInfo()
    const { payload: messages } = await getMessagesFromOrderAction({ storeSlug, orderId })

    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading messages...</div>}>
            <OrderChatWrapper 
                messages={messages || []} 
                currentUser={user} 
                orderId={orderId} 
            />
        </Suspense>
    )
}
export { OrderChat }