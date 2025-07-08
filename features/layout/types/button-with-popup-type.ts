import * as Yup from "yup"

export type ButtonWithPopupPropsType<T> = {
    text: string
    children: React.ReactNode
    title: string
    description: string
    action: (payload: any) => Promise<{ error: boolean, message: string, payload: T }>
    disabled?: boolean
    messages: {
        success: string
        error: string
        loading: string
    }
    schema: Yup.ObjectSchema<any>
}