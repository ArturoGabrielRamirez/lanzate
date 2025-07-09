'use client'

import { FormProvider, useForm, UseFormProps, type SubmitHandler } from 'react-hook-form'
import { LoadingSubmitButtonContext } from '@/features/layout/components'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FieldValues } from 'react-hook-form'
import { FormPropsType } from '../types/form-type'
import { ResponseType } from '../types/response-type'
import { cn } from '@/lib/utils'

export default function Form<T extends FieldValues>({
    children,
    resolver,
    contentButton,
    formAction,
    successRedirect,
    successMessage = 'Success!',
    loadingMessage = 'Loading...',
    className,
    onComplete,
}: FormPropsType<T>) {

    const config: UseFormProps<T> = { mode: 'onChange' }

    if (resolver) config.resolver = resolver

    const router = useRouter()
    const methods = useForm<T>(config)

    const { handleSubmit } = methods

    const onSubmit: SubmitHandler<T> = async (data) => {
        return new Promise(async (resolve, reject) => {
            toast.promise(formAction(data), {
                loading: loadingMessage,
                success: (data: ResponseType<T>) => {
                    if (data && data.error) throw new Error(data.message)
                    successRedirect && router.push(successRedirect)
                    return successMessage
                },
                error: (error) => {
                    reject(error)
                    return error.message
                },
                finally: () => {
                    resolve(true)
                    onComplete && typeof onComplete === 'function' && onComplete()
                }
            })
        })
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-4", className)}>
                {children}
                <LoadingSubmitButtonContext text={contentButton} />
            </form>
        </FormProvider>
    )
}
