import * as yup from "yup"

export const branchCreateSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().required("Phone is required"),
    email: yup.string().email("Email must be valid")
})

export const branchUpdateSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
    address: yup.string(),
    phone: yup.string(),
    email: yup.string().email("Email must be valid"),
    is_main: yup.boolean()
})
