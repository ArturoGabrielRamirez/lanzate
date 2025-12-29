import { ReactNode } from "react"
import { FieldValues, Resolver, DefaultValues } from "react-hook-form"

import { ServerResponse } from "@/features/global/types"

export type FormPropsType<T extends FieldValues> = {
    children?: ReactNode
    resolver?: Resolver<T, unknown>
    contentButton?: ReactNode
    formAction?: (formData: T) => Promise<ServerResponse<unknown>>
    successRedirect?: string
    successMessage?: string
    loadingMessage?: string
    className?: string
    onComplete?: () => void
    onSuccess?: () => void
    onError?: () => void
    disabled?: boolean
    submitButton?: boolean
    resetOnSuccess?: boolean
    submitButtonClassName?: string
    onSubmitStart?: () => void | Promise<void>
    onSubmitEnd?: () => void | Promise<void>
    // ✅ CORRECCIÓN: Usar DefaultValues<T> en lugar de UseFormProps
    defaultValues?: DefaultValues<T>
}