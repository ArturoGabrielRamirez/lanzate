import { MessageType } from "@prisma/client"

export interface InsertNewOrderMessageDataProps {
    orderId: number
    message: string
    messageType: MessageType
}

export interface CreateNewOrderMessageAction {
    orderId: number
    message: string
    messageType: MessageType
}

export interface OrderIdProp {
    orderId: number
}