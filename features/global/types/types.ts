import { ActionType, EntityType } from "@prisma/client"
import { KeyboardEvent } from 'react'

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
    options: { value: string, label: string | React.ReactNode }[]
    placeholder?: string
    description?: string | React.ReactNode
    tooltip?: string | React.ReactNode
    isRequired?: boolean
    disabled?: boolean
    startIcon?: React.ReactNode
    onChange?: (value: string) => void
}

export interface ReplyData {
    recipientEmail: string;
    recipientName?: string;
    category?: string;
    originalMessage: string;
    replyMessage: string;
    agentName?: string;
}

export interface CheckboxFieldProps {
    name: string
    label: string
    defaultValue?: boolean
    onChange?: (checked: boolean) => void
    className?: string
    containerClassName?: string
    disabled?: boolean
}

export type InputFieldProps = {
    name: string
    label: string
    type?: string
    defaultValue?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
    className?: string
    containerClassName?: string
    onKeyDown?: (e: (React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) | KeyboardEvent<HTMLInputElement>) => void
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    placeholder?: string,
    disabled?: boolean

    isTextArea?: boolean
    isRequired?: boolean
    inputMode?: "search" | "text" | "numeric" | "none" | "tel" | "url" | "email" | "decimal" | undefined
    maxLength?: number

}

export type LandingSectionIconTitleProps = {
    icon?: React.ReactNode
    children: React.ReactNode
    containerClassName?: string
    titleClassName?: string
}

export type LandingSectionTitleProps = {
    children: React.ReactNode
    className?: string
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

export interface WaitlistWelcomeProps {
    recipientEmail: string;
}

export interface ShortcutHintProps {
    keys: string[]
    label?: string
    variant?: "default" | "secondary" | "outline" | "destructive"
    size?: "sm" | "md"
}

export interface KeyboardShortcut {
    keys: string[]
    description: string
    category: 'global' | 'sale'
    condition?: string
}

export interface KeyboardShortcutsConfig {
    // Callbacks para acciones específicas
    onNewSale?: () => void
    onFinalizeSale?: () => void
    onCalculateChange?: () => void
    onPrintReceipt?: () => void
    onClearCart?: () => void
    onRefund?: () => void
    onFocusSearch?: () => void
    onClearSearch?: () => void
    onIncreaseQuantity?: () => void
    onDecreaseQuantity?: () => void

    // Control de contexto
    isInSale?: boolean
    hasCartItems?: boolean

    // Deshabilitar shortcuts globalmente
    disabled?: boolean
}