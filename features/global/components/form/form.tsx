"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm, UseFormProps, type SubmitHandler, FieldValues, Resolver, DefaultValues } from "react-hook-form"
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
    successMessage = 'Operación exitosa!',
    loadingMessage = 'Cargando...',
    className,
    onComplete,
    onSuccess,
    onError,
    disabled = false,
    submitButton = true,
    resetOnSuccess = false,
    submitButtonClassName,
    onSubmitStart,
    onSubmitEnd,
    defaultValues
}: FormPropsType<T>) {

    const config: UseFormProps<T> = {
        mode: "onChange",
        disabled,
        defaultValues: defaultValues as DefaultValues<T>
    }
    if (resolver) config.resolver = resolver as Resolver<T, unknown, T>

    const router = useRouter()
    const methods = useForm<T>(config)
    const { handleSubmit, reset/* , watch */ } = methods

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues as DefaultValues<T>)
        }
    }, [defaultValues, reset])

    const onSubmit: SubmitHandler<T> = async (data) => {
        if (!formAction) return

        if (onSubmitStart) await onSubmitStart()

        const actionPromise = new Promise<ServerResponse<unknown>>(async (resolve, reject) => {
            try {
                const resp = await formAction(data) as ServerResponse<unknown>

                if (resp && resp?.hasError) {
                    throw new Error(resp.message)
                }

                resolve(resp)
            } catch (error) {
                reject(error)
            }
        })

        toast.promise(actionPromise, {
            loading: loadingMessage,
            success: (resp) => {
                if (resetOnSuccess) reset()
                if (successRedirect) router.push(successRedirect)
                if (onSuccess) onSuccess()
                return resp?.message || successMessage
            },
            error: (error) => {
                if (onError) onError()
                return error.message || "Ocurrió un error"
            },
        })

        try {
            await actionPromise
        } finally {
            if (onComplete) onComplete()
            if (onSubmitEnd) await onSubmitEnd()
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-4", className)}>
                {children}
                {submitButton && (
                    <LoadingSubmitButtonContext
                        text={contentButton}
                        disabled={disabled}
                        className={submitButtonClassName}
                    />
                )}
            </form>
        </FormProvider>
    )
}

export { Form }