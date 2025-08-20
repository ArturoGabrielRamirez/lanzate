"use client"

import { Button } from "@/components/ui/button"
import { useChat } from "@/features/layout/components/chat-provider"
import { MessageCircle } from "lucide-react"

const OpenChatButton = ({ roomId }: { roomId: string }) => {

    const { handleOpenChat } = useChat()

    const handleOpenChatWithRoomId = async () => {
        try {
            await handleOpenChat(roomId)
        } catch (error) {
            console.error('Error opening chat:', error)
        }
    }

    return (
        <Button onClick={handleOpenChatWithRoomId}>
            <MessageCircle className="size-4" />
            Open Chat
        </Button>
    )
}
export default OpenChatButton