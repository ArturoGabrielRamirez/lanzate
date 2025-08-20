"use client"

import { createContext, useContext, useState } from "react"
import { fetchOrderMessages } from "@/features/chat/actions/getOrderMessages"
import { ChatMessage } from "@/hooks/use-realtime-chat"

type ChatState = {
    roomId: string
    isMaximized: boolean
    messages: ChatMessage[]
    isLoading: boolean
}

type Props = {
    children: React.ReactNode
}

const ChatContext = createContext<{
    isOpen: boolean
    rooms: string[]
    chatStates: ChatState[]
    selectedRoom: string | null
    handleOpenChat: (roomId: string) => Promise<void>
    handleCloseChat: (roomId: string) => void
    handleToggleChat: () => void
    handleMaximizeChat: (roomId: string) => void
    handleMinimizeChat: (roomId: string) => void
    isChatMaximized: (roomId: string) => boolean
    getChatMessages: (roomId: string) => ChatMessage[]
    isChatLoading: (roomId: string) => boolean
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
    rooms: [],
    chatStates: [],
    selectedRoom: null
})

export const ChatProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [rooms, setRooms] = useState<string[]>([])
    const [chatStates, setChatStates] = useState<ChatState[]>([])
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

    const handleOpenChat = async (roomId: string) => {
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
                isLoading: true
            }])

            try {
                // Cargar mensajes previos de la base de datos
                const { payload: messages, error } = await fetchOrderMessages(Number(roomId))
                
                if (error) {
                    console.error('Error loading messages:', error)
                }

                // Actualizar el estado del chat con los mensajes cargados
                setChatStates(prevStates => 
                    prevStates.map(chat => 
                        chat.roomId === roomId 
                            ? { ...chat, messages: messages || [], isLoading: false }
                            : chat
                    )
                )
            } catch (error) {
                console.error('Error opening chat:', error)
                // Si hay error, mantener el chat pero sin mensajes
                setChatStates(prevStates => 
                    prevStates.map(chat => 
                        chat.roomId === roomId 
                            ? { ...chat, messages: [], isLoading: false }
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