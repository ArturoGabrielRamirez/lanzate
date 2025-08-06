"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { type User, type MessageWithSender } from "./order-chat-context"

type Props = {
    messages: MessageWithSender[]
    currentUser: User | null
}

function OrderChatMessages({ messages, currentUser }: Props) {
    if (!messages || messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                    <p>No hay mensajes aún</p>
                    <p className="text-sm">Sé el primero en enviar un mensaje</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message: MessageWithSender) => {
                const isOwnMessage = currentUser?.id === message.sender_id
                const senderName = message.sender.first_name && message.sender.last_name 
                    ? `${message.sender.first_name} ${message.sender.last_name}`
                    : message.sender.first_name || message.sender.email

                return (
                    <div
                        key={message.id}
                        className={cn(
                            "flex gap-3",
                            isOwnMessage ? "justify-end" : "justify-start"
                        )}
                    >
                        {!isOwnMessage && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={message.sender.avatar || undefined} />
                                <AvatarFallback>
                                    {senderName.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        
                        <div className={cn(
                            "flex flex-col max-w-[70%]",
                            isOwnMessage ? "items-end" : "items-start"
                        )}>
                            {!isOwnMessage && (
                                <span className="text-xs text-muted-foreground mb-1">
                                    {senderName}
                                </span>
                            )}
                            
                            <Card className={cn(
                                "p-3",
                                isOwnMessage 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-muted"
                            )}>
                                <CardContent className="p-0">
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                        {message.message}
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <span className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(message.created_at), {
                                    addSuffix: true,
                                    locale: es
                                })}
                            </span>
                        </div>

                        {isOwnMessage && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={currentUser?.avatar || undefined} />
                                <AvatarFallback>
                                    {currentUser?.first_name?.charAt(0).toUpperCase() || 
                                     currentUser?.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default OrderChatMessages