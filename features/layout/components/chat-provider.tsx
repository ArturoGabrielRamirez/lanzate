"use client"

import { createContext, useContext, useState } from "react"

type ChatState = {
    roomId: string
    isMaximized: boolean
}

type Props = {
    children: React.ReactNode
}

const ChatContext = createContext<{
    isOpen: boolean
    rooms: string[]
    chatStates: ChatState[]
    selectedRoom: string | null
    handleOpenChat: (roomId: string) => void
    handleCloseChat: (roomId: string) => void
    handleToggleChat: () => void
    handleMaximizeChat: (roomId: string) => void
    handleMinimizeChat: (roomId: string) => void
    isChatMaximized: (roomId: string) => boolean
}>({
    isOpen: false,
    handleOpenChat: () => { },
    handleCloseChat: () => { },
    handleToggleChat: () => { },
    handleMaximizeChat: () => { },
    handleMinimizeChat: () => { },
    isChatMaximized: () => false,
    rooms: [],
    chatStates: [],
    selectedRoom: null
})

export const ChatProvider = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [rooms, setRooms] = useState<string[]>([])
    const [chatStates, setChatStates] = useState<ChatState[]>([])
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

    const handleOpenChat = (roomId: string) => {
        setIsOpen(true)
        setSelectedRoom(roomId)
        
        // Si el chat no existe, agregarlo maximizado
        if (!rooms.includes(roomId)) {
            setRooms([...rooms, roomId])
            setChatStates([...chatStates, { roomId, isMaximized: true }])
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

    return (
        <ChatContext.Provider value={{ 
            isOpen, 
            handleOpenChat, 
            handleCloseChat, 
            handleToggleChat, 
            handleMaximizeChat,
            handleMinimizeChat,
            isChatMaximized,
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