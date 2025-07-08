'use client'

import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FieldValues } from 'react-hook-form'
import { FormPropsType } from '../types/form-type'
import { ResponseType } from '../types/response-type'
import LoadingSubmitButtonContext from './loading-submit-button-context'

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

    const router = useRouter()
    const methods = useForm<T>({ resolver, mode: 'onChange' })

    const { handleSubmit } = methods

    const onSubmit: SubmitHandler<T> = async (data) => {
        return new Promise(async (resolve, reject) => {
            toast.promise(formAction(data), {
                loading: loadingMessage,
                success: (data: ResponseType<T>) => {
                    if (data && data.error) throw new Error(data.message)
                    return successMessage
                },
                error: (error) => {
                    reject(error)
                    return error.message
                },
                finally: () => {
                    resolve(true)
                    successRedirect && router.push(successRedirect)
                    onComplete && typeof onComplete === 'function' && onComplete()
                }
            })
        })

    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={className}>
                {children}
                <LoadingSubmitButtonContext text={contentButton} />
            </form>
        </FormProvider>
    )
}
