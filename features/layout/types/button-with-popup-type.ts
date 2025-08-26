import { Resolver, FieldValues } from "react-hook-form"
import { ResponseType } from "./"
import { ObjectSchema } from "yup"

export type ButtonWithPopupPropsType<T, P extends FieldValues> = {
  text: string | React.ReactNode
  children?: React.ReactNode
  title?: string
  description?: string
  action: (payload: P) => Promise<ResponseType<T> | undefined>
  messages: {
    success: string
    error: string
    loading: string
  }
  disabled?: boolean
  schema?: ObjectSchema<P>
  onComplete?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  formDisabled?: boolean
  contentButton?: string | React.ReactNode
  onlyIcon?: boolean
}