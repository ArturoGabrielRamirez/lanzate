import * as Yup from "yup"
import { ResponseType } from "./"

export type ButtonWithPopupPropsType<T> = {
    text: string | React.ReactNode
    children?: React.ReactNode
    title: string
    description: string
    action: (payload: any) => Promise<ResponseType<T>>
    disabled?: boolean
    messages: {
        success: string
        error: string
        loading: string
    }
    schema?: Yup.ObjectSchema<any>
    onComplete?: () => void
    variant?: "default" | "destructive"
}