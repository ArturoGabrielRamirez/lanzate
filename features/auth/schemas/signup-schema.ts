import * as yup from 'yup'

export const signupSchema = yup.object({
  email: yup.string().email('email must be a valid email').required('Email is required'),
  password: yup.string().min(6, 'user password must be at least 6 characters long').required('Password is required'),
})
