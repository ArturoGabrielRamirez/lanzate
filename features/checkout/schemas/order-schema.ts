import * as yup from 'yup'

const personalInfoSchema = {
    name: yup.string().required('Name is required'),
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
}

const shippingInfoSchema = {
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
}

export const pickupOrderSchema = yup.object({
    ...personalInfoSchema,
})

export const deliveryOrderSchema = yup.object({
    ...personalInfoSchema,
    ...shippingInfoSchema,
})

