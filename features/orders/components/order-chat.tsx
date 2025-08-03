import { AutosizeTextarea } from "@/components/expansion/autosize-textarea"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"
import OrderChatMessages from "./order-chat-messages"
import { Suspense } from "react"

type Props = {
    storeSlug: string
    orderId: string
}
async function OrderChat({ storeSlug, orderId }: Props) {


    return (
        <div className="w-full">
            <Suspense fallback={<div>Loading...</div>}>
                <OrderChatMessages storeSlug={storeSlug} orderId={orderId} />
            </Suspense>
            <div className="flex items-center relative">
                <Button variant="outline" size="icon" className="absolute left-2">
                    <Paperclip />
                </Button>
                <AutosizeTextarea className="w-full pr-22 pl-14" />
                <Button className="absolute right-2">Send</Button>
            </div>
        </div>
    )
}
export default OrderChat