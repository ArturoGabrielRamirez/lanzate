"use client"

import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useChat } from "./chat-provider"
import { RealtimeChat } from "@/components/realtime-chat"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { X, Minimize2, Maximize2, Loader2 } from "lucide-react"
import { ChatMessage } from "@/hooks/use-realtime-chat"

const ChatDoc = () => {

    const {
        isOpen,
        rooms,
        handleCloseChat,
        handleMaximizeChat,
        handleMinimizeChat,
        isChatMaximized,
        getChatMessages,
        isChatLoading,
        isOrderCompleted,
        getChatUsername,
        getChatMessageType
    } = useChat()

    const handleMessage = (messages: ChatMessage[]) => {
        console.log(messages)
        /* 
        Each message looks like this:
        {
            "id": "a20676ba-e1b4-45c7-87bf-5741077acfa8",
            "content": "test",
            "user": {
                "name": "Store"
            },
            "createdAt": "2025-08-20T23:28:21.709Z"
        }
        */
    }

    return (
        <div className="fixed bottom-0 w-fit min-h-20 z-50 flex gap-2 items-end justify-end container right-4">
            <AnimatePresence>
                {isOpen && rooms.length > 0 && (
                    <>
                        {rooms.map((roomId) => {
                            const isMaximized = isChatMaximized(roomId)
                            const messages = getChatMessages(roomId)
                            const isLoading = isChatLoading(roomId)
                            const username = getChatUsername(roomId)
                            const messageType = getChatMessageType(roomId)

                            return (
                                <motion.div
                                    key={roomId}
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 100 }}
                                    className="w-full max-w-xs"
                                >
                                    <div className={`flex items-center justify-between bg-background border rounded-t-lg p-2 ${!isMaximized ? 'rounded-b-lg' : ''}`}>
                                        <button
                                            onClick={() => isMaximized
                                                ? handleMinimizeChat(roomId)
                                                : handleMaximizeChat(roomId)
                                            }
                                            className="flex-1 text-left font-medium hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                                        >
                                            {isLoading && (
                                                <Loader2 className="size-4 animate-spin" />
                                            )}
                                            Order {roomId}
                                            {!isMaximized && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    (minimized)
                                                </span>
                                            )}
                                        </button>
                                        <div className="flex gap-1">
                                            <IconButton
                                                icon={isMaximized ? Minimize2 : Maximize2}
                                                onClick={() => isMaximized
                                                    ? handleMinimizeChat(roomId)
                                                    : handleMaximizeChat(roomId)
                                                }
                                                size="sm"
                                            />
                                            <IconButton
                                                icon={X}
                                                onClick={() => handleCloseChat(roomId)}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                    {isMaximized && (
                                        <motion.div
                                            className="bg-background border-x border-b rounded-b-lg"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center p-8">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Loader2 className="size-4 animate-spin" />
                                                        <span className="text-sm">Loading messages...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <RealtimeChat 
                                                    roomName={roomId} 
                                                    username={username} 
                                                    onMessage={handleMessage} 
                                                    messageType={messageType}
                                                    messages={messages}
                                                    emptyStateText="No hay mensajes aún. ¡Inicia la conversación con el cliente!"
                                                    completedOrderText="Esta orden ha sido completada y ya no puedes enviar más mensajes al cliente."
                                                    disabled={isOrderCompleted(roomId)}
                                                />
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
export default ChatDoc