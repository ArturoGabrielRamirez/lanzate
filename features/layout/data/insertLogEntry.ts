"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"
import { InsertLogEntryProps } from "../types"

export async function insertLogEntry({ action, entity_id, entity_type, details, action_initiator, user_id }: InsertLogEntryProps) {
    return actionWrapper(async () => {

        const prisma = new PrismaClient()

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
            error: false,
            message: "Log entry created"
        }
    })

}
