"use client"

import { Button } from "@/components/ui/button"
import { useChat } from "@/features/layout/components/chat-provider"
import { MessageCircle } from "lucide-react"

const OpenChatButton = ({ roomId }: { roomId: string }) => {

    const { handleOpenChat } = useChat()

    const handleOpenChatWithRoomId = () => {
        handleOpenChat(roomId)
    }

    return (
        <Button onClick={handleOpenChatWithRoomId}>
            <MessageCircle className="size-4" />
            Open Chat
        </Button>
    )
}
export default OpenChatButton