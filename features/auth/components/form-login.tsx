'use client'

import { handleSignup } from '@/features/auth/actions/handleSignUp'
import { schema } from '@/features/auth/schemas/log-user-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, InputField } from '@/features/layout/components'

export default function LoginForm() {
    return (
        <Form
            resolver={yupResolver(schema)}
            formAction={handleSignup}
            contentButton="Log in"
            successRedirect="/account"
            successMessage="You have been logged in!"
            loadingMessage="Logging in..."
            className={`flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`}
        >
            <InputField name="email" label="Email" type="email" />
            <InputField name="password" label="Password" type="password" />
        </Form>
    )
}