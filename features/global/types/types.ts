import { ActionType, EntityType } from "@prisma/client"

export type InsertLogEntryProps = {
    action: ActionType
    entity_id: number
    entity_type: EntityType
    details: string
    action_initiator: string
    user_id: number
}