import * as yup from 'yup'

export const schema = yup.object({
    password: yup.string().min(6, 'User password must be at least 6 characters long').required('Password is required'),
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    username: yup.string().required('Username is required'),
    /* name: yup.string().default(undefined),
    lastname: yup.string().default(undefined),
    phone: yup.string().default(undefined) */
})

// Definir el tipo manualmente para que coincida con React Hook Form
/* export type SignupFormData = {
    password: string;
    email: string;
    username: string;
    name?: string | null;
    lastname?: string | null;
    phone?: string | null;
} */