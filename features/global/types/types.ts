import { ActionType, EntityType } from "@prisma/client"

export type InsertLogEntryProps = {
    action: ActionType
    entity_id: number
    entity_type: EntityType
    details: string
    action_initiator: string
    user_id: number
}

export interface EmailTemplateProps {
    name?: string;
    email: string;
    category?: string;
    message: string;
}

export interface ReplyEmailTemplateProps {
    recipientName?: string;
    recipientEmail: string;
    category?: string;
    originalMessage: string;
    replyMessage: string;
    agentName?: string;
}

export interface ReplyFormProps {
    messageId?: string; // ID del mensaje en DB
    recipientEmail: string;
    recipientName?: string;
    category?: string;
    originalMessage: string;
    onSuccess?: () => void;
}

export interface ContactFormProps {
    onSuccess?: () => void;
}

export type SelectFieldProps = {
    name: string
    label: string
    options: { value: string, label: string }[]
    placeholder?: string
    description?: string | React.ReactNode
    tooltip?: string | React.ReactNode
    isRequired?: boolean
    disabled?: boolean
    startIcon?: React.ReactNode
}

export interface ReplyData {
    recipientEmail: string;
    recipientName?: string;
    category?: string;
    originalMessage: string;
    replyMessage: string;
    agentName?: string;
}