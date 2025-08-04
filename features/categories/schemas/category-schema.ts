import * as yup from 'yup'

export const createCategorySchema = yup.object({
    name: yup.string()
        .required('El nombre de la categoría es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    description: yup.string()
        .max(200, 'La descripción no puede exceder 200 caracteres')
        .optional(),
    image: yup.string()
        .url('Debe ser una URL válida')
        .optional(),
    sort_order: yup.number()
        .min(0, 'El orden debe ser mayor o igual a 0')
        .optional()
})

export const updateCategorySchema = yup.object({
    name: yup.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .optional(),
    description: yup.string()
        .max(200, 'La descripción no puede exceder 200 caracteres')
        .optional(),
    image: yup.string()
        .url('Debe ser una URL válida')
        .optional(),
    sort_order: yup.number()
        .min(0, 'El orden debe ser mayor o igual a 0')
        .optional(),
    is_active: yup.boolean()
        .optional()
}) 