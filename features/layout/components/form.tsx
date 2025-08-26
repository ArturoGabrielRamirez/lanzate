"use client"

import { FormProvider, useForm, UseFormProps, type SubmitHandler, FieldValues, Resolver } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { LoadingSubmitButtonContext } from "@/features/layout/components"
import { FormPropsType, ResponseType } from "@/features/layout/types"
import { cn } from "@/lib/utils"

export default function Form<T extends FieldValues>({
  children,
  resolver,
  contentButton,
  formAction,
  successRedirect,
  successMessage = "Success!",
  loadingMessage = "Loading...",
  className,
  onComplete,
  onSuccess,
  onError,
  disabled = false,
}: FormPropsType<T>) {
  const config: UseFormProps<T> = { mode: "onChange" }

  if (resolver) {
    config.resolver = resolver
  }

  const router = useRouter()
  const methods = useForm<T>(config)
  const { handleSubmit } = methods

  const onSubmit: SubmitHandler<T> = async (data) => {
    return new Promise(async (resolve, reject) => {
      toast.promise(formAction(data), {
        loading: loadingMessage,
        success: (res: ResponseType<any> | undefined) => {
          if (res && res.error) throw new Error(res.message)
          if (successRedirect) router.push(successRedirect)
          if (onSuccess) onSuccess()
          return successMessage
        },
        error: (error) => {
          if (onError) onError()
          reject(error)
          return error.message
        },
        finally: () => {
          resolve(true)
          if (onComplete) onComplete()
        },
      })
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-4", className)}>
        {children}
        <LoadingSubmitButtonContext text={contentButton} disabled={disabled} />
      </form>
    </FormProvider>
  )
}