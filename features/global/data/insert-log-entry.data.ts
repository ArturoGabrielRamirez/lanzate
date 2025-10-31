"use server"

import { InsertLogEntryProps } from "@/features/global/types/types"
import { actionWrapper } from '@/features/global/utils'
import { prisma } from "@/utils/prisma"

export async function insertLogEntry({ action, entity_id, entity_type, details, action_initiator, user_id }: InsertLogEntryProps) {
    return actionWrapper(async () => {

        const logEntry = await prisma.actionLog.create({
            data: {
                action: action,
                entity_id: entity_id,
                entity_type: entity_type,
                details: details,
                action_initiator: action_initiator,
                user_id: user_id
            }
        })

        return {
            payload: logEntry,
            hasError: false,
            message: "Log entry created"
        }
    })

}
