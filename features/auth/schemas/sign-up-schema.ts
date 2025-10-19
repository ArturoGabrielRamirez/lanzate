import * as yup from 'yup'

export const signUpSchema = yup.object({
    password: yup.string().min(6, 'User password must be at least 6 characters long').required('Password is required'),
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    'confirm-password': yup.string().required('Confirm password is required').oneOf([yup.ref('password')], 'Passwords must match'),
})