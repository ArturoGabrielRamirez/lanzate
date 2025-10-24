import * as yup from 'yup'

import { passwordSchema, emailSchema } from '@/features/auth/schemas'

export const signUpSchema = yup.object({
    password: passwordSchema,
    /*  password: yup.string().min(6, 'User password must be at least 6 characters long').required('Password is required'), */
    email: emailSchema,
    username: yup.string().required('Username is required'),
    'confirm-password': yup.string().required('Confirm password is required').oneOf([yup.ref('password')], 'Passwords must match'),
})