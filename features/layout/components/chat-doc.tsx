"use client"

import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useChat } from "./chat-provider"
import { RealtimeChat } from "@/components/realtime-chat"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { X, Minimize2, Maximize2 } from "lucide-react"
import { ChatMessage } from "@/hooks/use-realtime-chat"

const ChatDoc = () => {

    const { 
        isOpen, 
        rooms, 
        handleCloseChat, 
        handleMaximizeChat, 
        handleMinimizeChat, 
        isChatMaximized 
    } = useChat()

    const handleMessage = (messages: ChatMessage[]) => {
        console.log(messages)
    }

    return (
        <div className="fixed bottom-0 w-fit min-h-20 z-50 flex gap-2 items-end justify-end container right-4">
            <AnimatePresence>
                {isOpen && rooms.length > 0 && (
                    <>
                        {rooms.map((roomId) => {
                            const isMaximized = isChatMaximized(roomId)
                            
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
                                            className="flex-1 text-left font-medium hover:text-primary transition-colors cursor-pointer"
                                        >
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
                                            <RealtimeChat roomName={roomId} username="Store" onMessage={handleMessage}/>
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