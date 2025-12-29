import { InferType } from "yup"

import { loginFormSchema } from "@/features/auth/schemas"

export interface LoginPageProps {
    searchParams: Promise<{
        error?: string
        message?: string
        subdomain?: string
        next?: string
    }>
}

export type LoginFormPayload = InferType<typeof loginFormSchema>