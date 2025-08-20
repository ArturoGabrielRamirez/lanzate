"use server"

import { prisma } from "@/utils/prisma"
import { ChatMessage } from "@/hooks/use-realtime-chat"

export async function getOrderMessages(orderId: number): Promise<ChatMessage[]> {
    console.log("🚀 ~ getOrderMessages ~ orderId:", orderId)
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
