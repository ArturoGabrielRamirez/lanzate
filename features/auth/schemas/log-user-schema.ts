import * as yup from 'yup'

export const loginFormSchema = yup.object({
  email: yup.string().email('Email must be a valid email').required('Email is required'),
  password: yup.string().min(6, 'User password must be at least 6 characters long').required('Password is required'),
})