import * as yup from "yup"

export const branchCreateSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string().required("Phone is required"),
    email: yup.string().email("Email must be valid").required("Email is required")
})

export const branchUpdateSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().optional(),
    address: yup.string().required("Address is required"),
    phone: yup.string().required("Phone is required"),
    email: yup.string().email("Email must be valid").required("Email is required"),
    is_main: yup.boolean().required("Is main is required").default(false)
}).required()

// Define el tipo explícitamente
export type BranchUpdateData = {
    name: string
    description?: string
    address: string
    phone: string
    email: string
    is_main: boolean
}

// Schema para validar el payload completo
export const branchUpdatePayloadSchema = yup.object({
    branchId: yup.number().required(),
    data: yup.object({
        name: yup.string().required("Name is required"),
        description: yup.string().optional(),
        address: yup.string().required("Address is required"),
        phone: yup.string().required("Phone is required"),
        email: yup.string().email("Email must be valid").required("Email is required"),
        is_main: yup.boolean().required().default(false)
    }).required() as yup.ObjectSchema<BranchUpdateData>,
    slug: yup.string().required(),
    userId: yup.number().required()
}).required()