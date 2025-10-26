"use server"

import { OrderIdProp } from "@/features/chat/types"
import { ChatMessage } from "@/features/shadcn/hooks/use-realtime-chat"
import { prisma } from "@/utils/prisma"

export async function getOrderMessagesData({ orderId }: OrderIdProp): Promise<ChatMessage[]> {
    try {
        const messages = await prisma.orderMessage.findMany({
            where: {
                order_id: orderId
            },
            include: {
                sender: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                created_at: 'asc'
            }
        })

        // Transform the messages to match the ChatMessage type
        const transformedMessages: ChatMessage[] = messages.map((message) => ({
            id: message.id.toString(),
            content: message.message,
            user: {
                name: message.message_type === "CUSTOMER_TO_STORE" ? "Customer" : "Store"
            },
            createdAt: message.created_at.toISOString()
        }))

        return transformedMessages
    } catch (error) {
        console.error('Error fetching order messages:', error)
        return []
    }
}
