import * as Yup from "yup"
import { ResponseType } from "./"

export type ButtonWithPopupPropsType<T, P> = {
    text: string | React.ReactNode
    children?: React.ReactNode
    title: string
    description: string
    action: (payload: P) => Promise<ResponseType<T>>
    disabled?: boolean
    messages: {
        success: string
        error: string
        loading: string
    }
    schema?: Yup.ObjectSchema<Yup.AnyObjectSchema> // aquí puedes refinar con Yup generics si quieres
    onComplete?: () => void
    variant?: "default" | "destructive" | "ghost"
    className?: string
    formDisabled?: boolean
    size?: "default" | "sm" | "lg" | "icon"
    contentButton?: string
    onlyIcon?: boolean
}