"use client"

import { Button } from "@/components/ui/button"
import { useChat } from "@/features/layout/components/chat-provider"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { MessageCircle } from "lucide-react"

type Props = {
    roomId: string
    onlyIcon?: boolean
}

const OpenChatButton = ({ roomId, onlyIcon = false }: Props) => {

    const { handleOpenChat } = useChat()

    const handleOpenChatWithRoomId = () => {
        handleOpenChat(roomId)
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