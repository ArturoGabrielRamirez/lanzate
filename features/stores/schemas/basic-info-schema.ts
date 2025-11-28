import * as yup from 'yup'

export const editBasicInfoSchema = yup.object({
    name: yup.string().required('El nombre es obligatorio').min(3, 'El nombre debe tener al menos 3 caracteres').max(50, 'El nombre debe tener menos de 50 caracteres').matches(/^[a-zA-Z0-9\s]+$/, 'El nombre solo puede contener letras, números y espacios'),
    description: yup.string().max(255, 'La descripción debe tener menos de 255 caracteres'),
    subdomain: yup.string().required('El subdominio es obligatorio').min(3, 'El subdominio debe tener al menos 3 caracteres').max(50, 'El subdominio debe tener menos de 50 caracteres').matches(/^[a-zA-Z\.]+$/, 'El subdominio solo puede contener letras'),
})

export const basicInfoSchema = yup.object({
    name: yup.string().required("El nombre es obligatorio"),
    description: yup.string().max(255, "La descripción debe tener menos de 255 caracteres"),
    subdomain: yup.string().required("El subdominio es obligatorio"),
    logo: yup
        .mixed()
        .test("logo-type", "Tipo de archivo no soportado. Usá JPG, PNG, GIF o WebP", (value) => {
            if (value instanceof File) {
                const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                return allowed.includes(value.type)
            }
            return true
        })
        .test("logo-size", "Archivo demasiado grande (máx 3MB)", (value) => {
            if (value instanceof File) {
                return value.size <= 3 * 1024 * 1024
            }
            return true
        }).nullable().optional(),
})
