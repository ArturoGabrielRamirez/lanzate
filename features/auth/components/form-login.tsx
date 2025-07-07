'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import Form from '../../layout/components/form'
import { handleSignup } from '@/features/auth/actions/handleSignUp'
import InputField from '../../layout/components/input'
import { schema } from '@/features/auth/schemas/log-user-schema'

export default function LoginForm() {
   const formPasswordClasses = `flex flex-col gap-3 sm:row-start-2 sm:col-start-1 sm:min-w-full sm:justify-center`
    return (
        <Form
            resolver={yupResolver(schema)}
            formAction={handleSignup}
            contentButton="Log in"
            successRedirect="/account"
            successMessage="You have been logged in!"
            loadingMessage="Logging in..."
            className={formPasswordClasses}
        >
            <InputField name="email" label="Email" type="email" />
            <InputField name="password" label="Password" type="password" />
        </Form>
    )
}