"use client"

import { createContext, useContext, useState } from "react"

import { fetchOrderMessages } from "@/features/chat/actions/getOrderMessages"
import { fetchOrderStatus } from "@/features/chat/actions/getOrderStatus"
import { ChatMessage } from "@/hooks/use-realtime-chat"

type ChatState = {
    roomId: string
    isMaximized: boolean
    messages: ChatMessage[]
    isLoading: boolean
    isOrderCompleted: boolean
    username: string
    messageType: "STORE_TO_CUSTOMER" | "CUSTOMER_TO_STORE"
}

type Props = {
    children: React.ReactNode
}

const ChatContext = createContext<{
    isOpen: boolean
    rooms: string[]
    chatStates: ChatState[]
    selectedRoom: string | null
    handleOpenChat: (roomId: string, username?: string, messageType?: "STORE_TO_CUSTOMER" | "CUSTOMER_TO_STORE") => Promise<void>
    handleCloseChat: (roomId: string) => void
    handleToggleChat: () => void
    handleMaximizeChat: (roomId: string) => void
    handleMinimizeChat: (roomId: string) => void
    isChatMaximized: (roomId: string) => boolean
    getChatMessages: (roomId: string) => ChatMessage[]
    isChatLoading: (roomId: string) => boolean
    isOrderCompleted: (roomId: string) => boolean
    getChatUsername: (roomId: string) => string
    getChatMessageType: (roomId: string) => "STORE_TO_CUSTOMER" | "CUSTOMER_TO_STORE"
}>({
    isOpen: false,
    handleOpenChat: async () => { },
    handleCloseChat: () => { },
    handleToggleChat: () => { },
    handleMaximizeChat: () => { },
    handleMinimizeChat: () => { },
    isChatMaximized: () => false,
    getChatMessages: () => [],
    isChatLoading: () => false,
    isOrderCompleted: () => false,
    getChatUsername: () => "Store",
    getChatMessageType: () => "STORE_TO_CUSTOMER",
    rooms: [],
    chatStates: [],
    selectedRoom: null
})

function ChatProvider({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [rooms, setRooms] = useState<string[]>([])
    const [chatStates, setChatStates] = useState<ChatState[]>([])
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

    const handleOpenChat = async (
        roomId: string, 
        username: string = "Store", 
        messageType: "STORE_TO_CUSTOMER" | "CUSTOMER_TO_STORE" = "STORE_TO_CUSTOMER"
    ) => {
        setIsOpen(true)
        setSelectedRoom(roomId)
        
        // Si el chat no existe, agregarlo maximizado y cargar mensajes
        if (!rooms.includes(roomId)) {
            // Agregar el chat inmediatamente con estado de carga
            setRooms([...rooms, roomId])
            setChatStates([...chatStates, { 
                roomId, 
                isMaximized: true,
                messages: [],
                isLoading: true,
                isOrderCompleted: false,
                username,
                messageType
            }])

            try {
                // Cargar mensajes previos y estado de la orden en paralelo
                const [messagesResult, orderStatusResult] = await Promise.all([
                    fetchOrderMessages(Number(roomId)),
                    fetchOrderStatus(Number(roomId))
                ])
                
                if (messagesResult.error) {
                    console.error('Error loading messages:', messagesResult.error)
                }

                if (orderStatusResult.error) {
                    console.error('Error loading order status:', orderStatusResult.error)
                }

                const isCompleted = orderStatusResult.payload?.status === "COMPLETED"

                // Actualizar el estado del chat con los mensajes cargados y el estado de la orden
                setChatStates(prevStates => 
                    prevStates.map(chat => 
                        chat.roomId === roomId 
                            ? { 
                                ...chat, 
                                messages: messagesResult.payload || [], 
                                isLoading: false,
                                isOrderCompleted: isCompleted
                            }
                            : chat
                    )
                )
            } catch (error) {
                console.error('Error opening chat:', error)
                // Si hay error, mantener el chat pero sin mensajes
                setChatStates(prevStates => 
                    prevStates.map(chat => 
                        chat.roomId === roomId 
                            ? { 
                                ...chat, 
                                messages: [], 
                                isLoading: false,
                                isOrderCompleted: false
                            }
                            : chat
                    )
                )
            }
        } else {
            // Si ya existe, maximizarlo
            handleMaximizeChat(roomId)
        }
    }

    const handleCloseChat = (roomId: string) => {
        setRooms(rooms.filter((room) => room !== roomId))
        setChatStates(chatStates.filter((chat) => chat.roomId !== roomId))
        
        if (selectedRoom === roomId) {
            setSelectedRoom(null)
        }
        
        if (rooms.length === 1) {
            setIsOpen(false)
        }
    }

    const handleToggleChat = () => {
        setIsOpen(!isOpen)
    }

    const handleMaximizeChat = (roomId: string) => {
        setChatStates(chatStates.map((chat) => 
            chat.roomId === roomId 
                ? { ...chat, isMaximized: true }
                : chat
        ))
    }

    const handleMinimizeChat = (roomId: string) => {
        setChatStates(chatStates.map((chat) => 
            chat.roomId === roomId 
                ? { ...chat, isMaximized: false }
                : chat
        ))
    }

    const isChatMaximized = (roomId: string) => {
        return chatStates.find((chat) => chat.roomId === roomId)?.isMaximized ?? false
    }

    const getChatMessages = (roomId: string) => {
        return chatStates.find((chat) => chat.roomId === roomId)?.messages ?? []
    }

    const isChatLoading = (roomId: string) => {
        return chatStates.find((chat) => chat.roomId === roomId)?.isLoading ?? false
    }

    const isOrderCompleted = (roomId: string) => {
        return chatStates.find((chat) => chat.roomId === roomId)?.isOrderCompleted ?? false
    }

    const getChatUsername = (roomId: string) => {
        return chatStates.find((chat) => chat.roomId === roomId)?.username ?? "Store"
    }

    const getChatMessageType = (roomId: string) => {
        return chatStates.find((chat) => chat.roomId === roomId)?.messageType ?? "STORE_TO_CUSTOMER"
    }

    return (
        <ChatContext.Provider value={{ 
            isOpen, 
            handleOpenChat, 
            handleCloseChat, 
            handleToggleChat, 
            handleMaximizeChat,
            handleMinimizeChat,
            isChatMaximized,
            getChatMessages,
            isChatLoading,
            isOrderCompleted,
            getChatUsername,
            getChatMessageType,
            rooms, 
            chatStates,
            selectedRoom 
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    return useContext(ChatContext)
}

export { ChatProvider }