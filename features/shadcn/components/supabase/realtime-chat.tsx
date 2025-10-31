'use client'

import { MessageType } from '@prisma/client'
import { Send } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { createNewOrderMessageAction } from '@/features/chat/actions/create-new-order-message.action'
import { ChatMessageItem } from '@/features/shadcn/components/supabase/chat-message'
import { Button } from '@/features/shadcn/components/ui/button'
import { Input } from '@/features/shadcn/components/ui/input'
import { useChatScroll } from '@/features/shadcn/hooks/use-chat-scroll'
import { type ChatMessage, useRealtimeChat } from '@/features/shadcn/hooks/use-realtime-chat'
import { cn } from '@/lib/utils'

interface RealtimeChatProps {
  roomName: string
  username: string
  onMessage?: (messages: ChatMessage[]) => void
  messages?: ChatMessage[]
  messageType: MessageType
  disabled?: boolean
  emptyStateText?: string
  completedOrderText?: string
}

/**
 * Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param onMessage - The callback function to handle the messages. Useful if you want to store the messages in a database.
 * @param messages - The messages to display in the chat. Useful if you want to display messages from a database.
 * @param disabled - Whether the chat is disabled (e.g., order completed)
 * @param emptyStateText - Custom text to show when there are no messages
 * @param completedOrderText - Custom text to show when order is completed
 * @returns The chat component
 */
export function RealtimeChat({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
  messageType,
  disabled = false,
  emptyStateText = "No messages yet. Start the conversation!",
  completedOrderText = "This order has been completed and you can no longer send messages to the store.",
}: RealtimeChatProps) {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  const [newMessage, setNewMessage] = useState('')

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    const sortedMessages = uniqueMessages.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    return sortedMessages
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!newMessage.trim() || !isConnected || disabled) return

      sendMessage(newMessage)
      //add a new action function to store the message in the database
      createNewOrderMessageAction({ orderId: Number(roomName), message: newMessage, messageType })
      setNewMessage('')
    },
    [newMessage, isConnected, sendMessage, disabled, roomName, messageType]
  )

  // Determine what text to show when there are no messages
  const getEmptyStateText = () => {
    if (disabled) {
      return (
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            {emptyStateText}
          </div>
          <div className="text-xs text-muted-foreground/70">
            {completedOrderText}
          </div>
        </div>
      )
    }
    return (
      <div className="text-center text-sm text-muted-foreground">
        {emptyStateText}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px]">
        {allMessages.length === 0 ? (
          getEmptyStateText()
        ) : null}
        <div className="space-y-1">
          {allMessages.map((message, index) => {
            const prevMessage = index > 0 ? allMessages[index - 1] : null
            const showHeader = !prevMessage || prevMessage.user.name !== message.user.name

            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <ChatMessageItem
                  message={message}
                  isOwnMessage={message.user.name === username}
                  showHeader={showHeader}
                />
              </div>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-border p-4">
        <Input
          className={cn(
            'rounded-full bg-background text-sm transition-all duration-300',
            isConnected && newMessage.trim() && !disabled ? 'w-[calc(100%-36px)]' : 'w-full'
          )}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={disabled ? "Chat disabled - Order completed" : "Type a message..."}
          disabled={!isConnected || disabled}
        />
        {isConnected && newMessage.trim() && !disabled && (
          <Button
            className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300"
            type="submit"
            disabled={!isConnected || disabled}
          >
            <Send className="size-4" />
          </Button>
        )}
      </form>
    </div>
  )
}
