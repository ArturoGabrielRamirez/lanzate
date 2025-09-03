import { Resolver, FieldValues } from "react-hook-form"
import { ResponseType } from "./"

// FormProps tipado genéricamente con T
export type FormPropsType<T extends FieldValues> = {

    children: React.ReactNode
    resolver?: Resolver<T, unknown, Partial<T>>
    contentButton: string | React.ReactNode
    formAction?: (formData: T) => Promise<ResponseType<T>> | (() => Promise<ResponseType<T>>) | ((data: T) => Promise<ResponseType<{ error: boolean, message: string, payload: null }>>) | ((formData: T) => Promise<ResponseType<unknown> | undefined>) | ((formData: T) => Promise<ResponseType<unknown>>) | ((formData: T) => Promise<ResponseType<unknown> | undefined>)
    successRedirect?: string
    successMessage?: string
    loadingMessage?: string
    className?: string
    onComplete?: () => void
    onSuccess?: () => void
    onError?: () => void
    disabled?: boolean
    submitButton?: boolean
}