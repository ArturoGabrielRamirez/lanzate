import { FieldValues } from "react-hook-form";
import { ObjectSchema } from "yup";
import { ResponseType } from ".";

//export type ButtonWithPopupPropsType<T> = {
export type ButtonWithPopupPropsType<P extends FieldValues> = {
    text: string | React.ReactNode
    children?: React.ReactNode
    title: string
    description: string
    //action: (payload: any) => Promise<ResponseType<T>>
    action: (payload: P) => Promise<ResponseType<any> | undefined>
    disabled?: boolean
    messages: {
        success: string
        error: string
        loading: string
    }
    //schema?: Yup.ObjectSchema<any>
    schema?: ObjectSchema<Partial<P>>;
    onComplete?: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string
    formDisabled?: boolean
    size?: "default" | "sm" | "lg" | "icon"
    contentButton?: string | React.ReactNode
    onlyIcon?: boolean
}