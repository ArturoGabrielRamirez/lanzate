'use client'

import { handleSignup } from '@/features/auth/actions/handleSignUp'
import { schema } from '@/features/auth/schemas/log-user-schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, InputField } from '@/features/layout/components'

export default function SignupForm() {
    return (
        <Form
            resolver={yupResolver(schema)}
            formAction={handleSignup}
            contentButton="Sign up"
            successRedirect="/check-email"
            successMessage="You have been registered!"
            loadingMessage="Signing up..."
            className="flex flex-col p-8 gap-4 w-full max-w-xl"
        >
            <InputField name="email" label="Email" type="email" />
            <InputField name="password" label="Password" type="password" />
        </Form>
    )
}