'use client'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Form from './form'
import { handleSignup } from '@/features/auth/actions/handleSignUp'
import InputField from './input'


const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
})

export default function FormClient() {
    return (
        <Form
            resolver={yupResolver(schema)}
            formAction={handleSignup}
            contentButton="Sign up"
            successRedirect="/check-email"
            successMessage="¡Registrado correctamente!"
            className="flex flex-col gap-4"
        >
            <InputField name="email" label="Email" type="email" />
            <InputField name="password" label="Password" type="password" />
        </Form>
    )
}

