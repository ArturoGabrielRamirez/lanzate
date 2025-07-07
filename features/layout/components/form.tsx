'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import type { AnyObjectSchema } from 'yup'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import LoadingSubmitButton from './loading-submit-button'

type FormValues = {
    email: string
    password: string
}

type FormProps = {
    children?: React.ReactNode
    className?: string
    contentButton: string
    formAction?: (formData: FormData) => Promise<unknown>
    resolverSchema?: AnyObjectSchema
    successRedirect?: string
    successMessage?: string
    loadingMessage?: string
}

const Form = ({
    children,
    resolverSchema,
    formAction,
    className,
    contentButton,
    successRedirect = '/account',
    successMessage = '',
    loadingMessage = 'Loading...'
}: FormProps) => {
    const methods = useForm<FormValues>({
        resolver: resolverSchema ? yupResolver(resolverSchema) : undefined,
        mode: 'onSubmit',
    })

    const router = useRouter()
    const { handleSubmit } = methods

    const onSubmit = async (data: FormValues) => {
        if (!formAction) return

        const toastId = toast.loading(loadingMessage)

        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)
            for (const [key, value] of Object.entries(data)) {
                if (key !== 'email' && key !== 'password') {
                    formData.append(key, value as string)
                }
            }

            const result = await formAction(formData)

            toast.dismiss(toastId)

            if ((result as { success: boolean })?.success) {
                toast.success(successMessage)
                router.push(successRedirect)
            } else {
                throw new Error('Form submission failed')
            }
        } catch (err) {
            toast.dismiss(toastId)
            toast.error('Invalid credentials or server error.')
            console.error('Form submission error:', err)
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={`flex flex-col gap-4 md:pt-2 ${className}`}
            >
                {children}
                <LoadingSubmitButton text={contentButton} />
            </form>
        </FormProvider>
    )
}

export default Form
