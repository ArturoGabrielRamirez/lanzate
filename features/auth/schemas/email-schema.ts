import * as yup from 'yup'

export const schema = yup.object({
    email: yup.string().email('Email must be a valid email').required('Email is required'),
})