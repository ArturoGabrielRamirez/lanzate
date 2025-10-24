import { FieldValues } from "react-hook-form";
import { ObjectSchema } from "yup";

import { ResponseType } from ".";

export type ButtonWithPopupPropsType<P extends FieldValues> = {
    text: string | React.ReactNode
    children?: React.ReactNode
    title: string
    description: string
    action: (payload: P) => Promise<ResponseType<unknown>>
    disabled?: boolean
    messages: {
        success: string
        error: string
        loading: string
    }
    schema?: ObjectSchema<Partial<P>>;
    onComplete?: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    className?: string
    formDisabled?: boolean
    size?: "default" | "sm" | "lg" | "icon"
    contentButton?: string | React.ReactNode
    onlyIcon?: boolean
}