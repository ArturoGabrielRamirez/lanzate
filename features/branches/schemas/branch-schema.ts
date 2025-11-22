import * as yup from "yup"

export const branchCreateSchema = yup.object().shape({
    name: yup.string().required("El nombre es obligatorio"),
    address: yup.string().required("La dirección es obligatoria"),
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup.string().email("El correo electrónico debe ser válido").required("El correo electrónico es obligatorio")
})

export const branchUpdateSchema = yup.object({
    name: yup.string().required("El nombre es obligatorio"),
    description: yup.string().optional(),
    address: yup.string().required("La dirección es obligatoria"),
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup.string().email("El correo electrónico debe ser válido").required("El correo electrónico es obligatorio"),
    is_main: yup.boolean().required("Es obligatorio indicar si es la sucursal principal").default(false)
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
        name: yup.string().required("El nombre es obligatorio"),
        description: yup.string().optional(),
        address: yup.string().required("La dirección es obligatoria"),
        phone: yup.string().required("El teléfono es obligatorio"),
        email: yup.string().email("El correo electrónico debe ser válido").required("El correo electrónico es obligatorio"),
        is_main: yup.boolean().required().default(false)
    }).required() as yup.ObjectSchema<BranchUpdateData>,
    slug: yup.string().required(),
    userId: yup.number().required()
}).required()