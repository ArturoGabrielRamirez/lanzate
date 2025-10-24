"use client"

import { useRouter } from 'next/navigation'
import { FormProvider, useForm, UseFormProps, type SubmitHandler, FieldValues, Resolver } from "react-hook-form"
import { toast } from 'sonner'

import LoadingSubmitButtonContext from '@/features/global/components/form/loading-submit-button-context'
import { ServerResponse } from '@/features/global/types'
import { FormPropsType } from '@/features/global/types/form-type'
import { cn } from '@/lib/utils'

function Form<T extends FieldValues>({
    children,
    resolver,
    contentButton,
    formAction,
    successRedirect,
    successMessage = 'Success!',
    loadingMessage = 'Loading...',
    className,
    onComplete,
    onSuccess,
    onError,
    disabled = false,
    submitButton = true

}: FormPropsType<T>) {
    const config: UseFormProps<T> = { mode: "onChange" }

    if (resolver) config.resolver = resolver as Resolver<T, unknown, T>

    const router = useRouter()
    const methods = useForm<T>(config)

    const { handleSubmit } = methods


    const onSubmit: SubmitHandler<T> = async (data) => {

        if (!formAction) return

        return new Promise(async (resolve, reject) => {
            const promise = formAction(data) as Promise<ServerResponse<unknown>>
            toast.promise(promise, {
                loading: loadingMessage,
                success: (resp: ServerResponse<unknown>) => {
                    if (resp && resp.error) throw new Error(resp.message)
                    if (successRedirect) router.push(successRedirect)
                    if (onSuccess && typeof onSuccess === 'function') onSuccess()
                    return successMessage
                },
                error: (error) => {
                    if (onError && typeof onError === 'function') onError()
                    reject(error)
                    return error.message
                },
                finally: () => {
                    resolve(true)
                    if (onComplete && typeof onComplete === 'function') onComplete()
                }
            })
        })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-4", className)}>
                {children}
                {submitButton && (
                    <LoadingSubmitButtonContext
                        text={contentButton}
                        disabled={disabled}
                    />
                )}
            </form>
        </FormProvider>
    )
}

export { Form };