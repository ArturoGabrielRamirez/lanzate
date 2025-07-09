import { Resolver } from "react-hook-form"
import { ResponseType } from "./"
import { FieldValues } from "react-hook-form"

export type FormPropsType<T extends FieldValues> = {
    children: React.ReactNode
    resolver?: Resolver<T>
    contentButton: string | React.ReactNode
    formAction: (formData: T) => Promise<ResponseType<T>>
    successRedirect?: string
    successMessage?: string
    loadingMessage?: string
    className?: string
    onComplete?: () => void
}