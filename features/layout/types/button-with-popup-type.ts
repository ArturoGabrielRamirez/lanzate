import { FieldValues } from "react-hook-form"
import { ObjectSchema } from "yup"
import { ReactNode } from "react"
import { ResponseType } from "./" // tu tipo de respuesta

export type ButtonWithPopupPropsType<P extends FieldValues> = {
  text: ReactNode
  children?: ReactNode
  title?: string
  description?: string
  action: (payload: P) => Promise<ResponseType<unknown> | undefined>
  messages: {
    success: string
    error: string
    loading: string
  }
  disabled?: boolean
  schema?: ObjectSchema<Partial<P>>
  onComplete?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  formDisabled?: boolean
  contentButton?: string | ReactNode
  onlyIcon?: boolean
}
