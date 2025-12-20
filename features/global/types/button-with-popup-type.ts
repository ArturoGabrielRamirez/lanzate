import { ReactNode } from "react"
import { FieldValues, DefaultValues } from "react-hook-form"
import { ObjectSchema } from "yup"

import { ServerResponse } from "@/features/global/types"

export type ButtonWithPopupPropsType<P extends FieldValues> = {
    text?: ReactNode
    children?: ReactNode
    title?: string
    description?: string
    action: (formData: P) => Promise<ServerResponse<unknown>>
    messages: {
        success: string
        error?: string
        loading: string
    }
    disabled?: boolean
    schema?: ObjectSchema<P>
    onComplete?: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    className?: string
    size?: "default" | "sm" | "lg" | "icon"
    formDisabled?: boolean
    contentButton?: ReactNode
    onlyIcon?: boolean
    // ✅ CORRECCIÓN: Usar DefaultValues<P> en lugar de UseFormProps
    defaultValues?: DefaultValues<P>
    'data-action'?: string
}