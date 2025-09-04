import { Resolver, FieldValues } from "react-hook-form"
import { ResponseType } from "./"

// FormProps tipado genéricamente con T
export type FormPropsType<T extends FieldValues> = {

    children: React.ReactNode
    resolver?: Resolver<T, unknown, T>
    contentButton: string | React.ReactNode
    formAction?: (formData: T) => Promise<ResponseType<unknown>>
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