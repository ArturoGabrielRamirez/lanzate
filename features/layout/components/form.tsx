'use client'

import {
    FormProvider,
    useForm,
    type Resolver,
    type SubmitHandler,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FieldValues } from 'react-hook-form'

type FormProps<T extends FieldValues> = {
    children: React.ReactNode
    resolver?: Resolver<T>
    contentButton: string
    formAction: (formData: FormData) => Promise<unknown>
    successRedirect?: string
    successMessage?: string
    loadingMessage?: string
    className?: string
}

export default function Form<T extends FieldValues>({
    children,
    resolver,
    contentButton,
    formAction,
    successRedirect = '/account',
    successMessage = 'Success!',
    loadingMessage = 'Loading...',
    className,
}: FormProps<T>) {
    const methods = useForm<T>({
        resolver,
        mode: 'onSubmit',
    })

    const router = useRouter()
    const { handleSubmit } = methods

    const onSubmit: SubmitHandler<T> = async (data) => {
        const toastId = toast.loading('Enviando...')
        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value)
            })
            if (loadingMessage) {
                toast.loading(loadingMessage, { id: toastId })
            }
            const result = await formAction(formData)
            toast.dismiss(toastId)
            if ((result as { success: boolean })?.success) {
                toast.success(successMessage)
                router.push(successRedirect)
            } else {
                throw new Error('Error in form submission')
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error('An error occurred.')
            console.error(err)
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={className}>
                {children}
                <Button type="submit">{contentButton}</Button>
            </form>
        </FormProvider>
    )
}
