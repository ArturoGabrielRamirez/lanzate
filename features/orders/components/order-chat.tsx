import OrderChatWrapper from "./order-chat-wrapper"
import { Suspense } from "react"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getMessagesFromOrderAction } from "../actions"

type Props = {
    storeSlug: string
    orderId: string
}

async function OrderChat({ storeSlug, orderId }: Props) {
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
export default OrderChat