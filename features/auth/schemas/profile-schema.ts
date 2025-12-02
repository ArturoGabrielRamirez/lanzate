import * as yup from 'yup';

export const profileSchema = yup.object({
    username: yup
        .string()
        .trim()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(30, 'El nombre de usuario debe tener máximo 30 caracteres')
        .matches(/^[a-zA-Z0-9_.-]+$/, 'Solo se permiten letras, números, puntos, guiones y guiones bajos')
        .required('El nombre de usuario es requerido'),

    firstName: yup
        .string()
        .trim()
        .max(50, 'El nombre debe tener máximo 50 caracteres')
        .nullable(),

    lastName: yup
        .string()
        .trim()
        .max(50, 'El apellido debe tener máximo 50 caracteres')
        .nullable(),

    phone: yup
        .string()
        .trim()
        .matches(/^$|^[\s\-\(\)\+]*\d{8,15}[\s\-\(\)\+]*$/, {
            message: 'El teléfono debe ser un número de 8 a 15 dígitos',
            excludeEmptyString: true,
        })
        .nullable(),
}).required();

export type ProfileFormData = yup.InferType<typeof profileSchema>;