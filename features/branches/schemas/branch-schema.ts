import * as yup from "yup"

export const branchUpdateFormSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string(),
    address: yup.string(),
    phone: yup.string(),
    email: yup.string().email("Email must be valid"),
    is_main: yup.boolean()
})

export const branchUpdateActionSchema = yup.object().shape({
    branchId: yup.number().required(),
    data: branchUpdateFormSchema.required(),
    slug: yup.string().required(),
    userId: yup.number().required()
})