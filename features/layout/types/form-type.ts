import { Resolver, FieldValues } from "react-hook-form"
import { ResponseType } from "./"

export type FormPropsType<T extends FieldValues> = {
  children: React.ReactNode
  resolver?: Resolver<T>
  contentButton: string | React.ReactNode
  formAction: (formData: T) => Promise<ResponseType<unknown> | undefined>
  successRedirect?: string
  successMessage?: string
  loadingMessage?: string
  className?: string
  onComplete?: () => void
  onSuccess?: () => void
  onError?: () => void
  disabled?: boolean
}