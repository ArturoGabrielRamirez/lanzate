import { Resolver, FieldValues } from "react-hook-form"

import { ActionFunction, ServerResponse } from "@/features/global/types"

export type FormPropsType<T extends FieldValues> = {

    children: React.ReactNode
    resolver?: Resolver<T, unknown, T>
    contentButton: string | React.ReactNode
    formAction?: (formData: T) => Promise<ServerResponse<unknown>> | ActionFunction<T>
    successRedirect?: string
    successMessage?: string
    loadingMessage?: string
    className?: string
    onComplete?: () => void | Promise<void>
    onSuccess?: () => void | Promise<void>
    onError?: () => void | Promise<void>
    disabled?: boolean
    submitButton?: boolean
}