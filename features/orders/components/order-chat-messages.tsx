import { getMessagesFromOrderAction } from "../actions"

type Props = {
    storeSlug: string
    orderId: string
}

async function OrderChatMessages({ storeSlug, orderId }: Props) {

    const { payload: messages } = await getMessagesFromOrderAction({ storeSlug, orderId })
    console.log("🚀 ~ OrderChatMessages ~ messages:", messages)

    return (
        <div>OrderChatMessages</div>
    )
}
export default OrderChatMessages