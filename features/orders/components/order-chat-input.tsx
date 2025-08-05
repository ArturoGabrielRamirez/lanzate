"use client"

import { AutosizeTextarea } from "@/components/expansion/autosize-textarea"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"
import { useState, useTransition } from "react"
import { usePathname } from "next/navigation"
import { insertOrderMessageAction } from "../actions"
import { toast } from "sonner"
import { useOrderChat, type User, type MessageWithSender } from "./order-chat-context"

type Props = {
    orderId: string
    user: User | null
}

function OrderChatInput({ orderId, user }: Props) {
    const [message, setMessage] = useState("")
    const [isPending, startTransition] = useTransition()
    const pathname = usePathname()
    const { addOptimisticMessage } = useOrderChat()

    async function handleSendMessage() {
        if (!user) {
            toast.error("Please login to send messages")
            return
        }

        if (!message.trim()) {
            toast.error("Please enter a message")
            return
        }

        if (message.trim().length > 1000) {
            toast.error("Message cannot exceed 1000 characters")
            return
        }

        const messageToSend = message.trim()
        setMessage("") // Clear input immediately

        // Create optimistic message
        const optimisticMessage: MessageWithSender = {
            id: Date.now(), // Temporary ID
            order_id: parseInt(orderId),
            sender_id: user.id,
            message: messageToSend,
            message_type: "STORE_TO_CUSTOMER",
            file_url: null,
            file_name: null,
            file_size: null,
            is_read: false,
            read_at: null,
            created_at: new Date(),
            updated_at: new Date(),
            sender: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                avatar: user.avatar
            }
        }

        // Add optimistic message immediately
        addOptimisticMessage(optimisticMessage)

        startTransition(async () => {
            try {
                const result = await insertOrderMessageAction({
                    orderId,
                    message: messageToSend,
                    pathname
                })

                if (result.error) {
                    toast.error(result.message)
                    setMessage(messageToSend) // Restore message on error
                } else {
                    toast.success("Message sent successfully")
                }
            } catch (error) {
                console.error("Error sending message:", error)
                toast.error("Failed to send message")
                setMessage(messageToSend) // Restore message on error
            }
        })
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex items-center relative">
            <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-2"
                disabled={isPending}
            >
                <Paperclip />
            </Button>
            <AutosizeTextarea 
                className="w-full pr-22 pl-14" 
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                maxLength={1000}
            />
            <Button 
                className="absolute right-2"
                onClick={handleSendMessage}
                disabled={isPending || !message.trim()}
            >
                {isPending ? "Sending..." : "Send"}
            </Button>
        </div>
    )
}

export default OrderChatInput 