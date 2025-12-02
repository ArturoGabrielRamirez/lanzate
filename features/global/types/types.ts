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
    messageId?: string;
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
    category: 'global' | 'sale' | 'account' | 'security' | 'membership' | 'danger-zone'
    condition?: string
}

export interface KeyboardShortcutsConfig {
    // ============ SALE CALLBACKS ============
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

    // ============ ACCOUNT CALLBACKS ============
    onEditProfile?: () => void
    onChangeAvatar?: () => void
    onChangeEmail?: () => void
    onChangePassword?: () => void
    onUpgradePlan?: () => void
    onCancelSubscription?: () => void
    onDeleteAccount?: () => void

    // ============ CONTEXT CONTROL ============
    // Sale context
    isInSale?: boolean
    hasCartItems?: boolean

    // Account context
    isInAccount?: boolean
    activeAccountTab?: 'account' | 'security' | 'membership' | 'danger-zone'

    // Global control
    disabled?: boolean

    onNavigateToAccount?: () => void
    onNavigateToSecurity?: () => void
    onNavigateToMembership?: () => void
    onNavigateToDangerZone?: () => void
}

export type HintMode = 'always' | 'hover' | 'never'

export interface KeyboardShortcutsStore {
    hintMode: HintMode
    setHintMode: (mode: HintMode) => void
    toggleHintMode: () => void
}

export interface KeyboardShortcutsHelpProps {
    isInSale?: boolean
    isInAccount?: boolean
    activeAccountTab?: 'account' | 'security' | 'membership' | 'danger-zone'
}

export interface DangerZoneRef {
    openDeleteDialog: () => void
}

declare global {
    interface Window {
        dangerZoneRef?: React.RefObject<DangerZoneRef | null>  // ✅ Agregar | null
    }
}