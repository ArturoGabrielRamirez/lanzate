"use client"

import { Button } from "@/components/ui/button"
import { useChat } from "@/features/layout/components/chat-provider"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { MessageCircle } from "lucide-react"

const OpenChatButton = ({ roomId , onlyIcon = false }: { roomId: string, onlyIcon?: boolean }) => {

    const { handleOpenChat } = useChat()

    const handleOpenChatWithRoomId = async () => {
        try {
            await handleOpenChat(roomId)
        } catch (error) {
            console.error('Error opening chat:', error)
        }
    }

    if (onlyIcon) {
        return (
            <IconButton icon={MessageCircle} onClick={handleOpenChatWithRoomId} />
        )
    }
    

    return (
        <Button onClick={handleOpenChatWithRoomId}>
            <MessageCircle className="size-4" />
            Open Chat
        </Button>
    )
}
export default OpenChatButton