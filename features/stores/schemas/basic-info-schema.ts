import * as yup from 'yup'

export const editBasicInfoSchema = yup.object({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be less than 50 characters long').matches(/^[a-zA-Z0-9\s]+$/, 'Name must contain only letters, numbers and spaces'),
    description: yup.string().max(255, 'Description must be less than 255 characters long'),
    subdomain: yup.string().required('Subdomain is required').min(3, 'Subdomain must be at least 3 characters long').max(50, 'Subdomain must be less than 50 characters long').matches(/^[a-zA-Z\.]+$/, 'Subdomain must contain only letters'),
})

export const basicInfoSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().max(255, "Description must be less than 255 characters long"),
    subdomain: yup.string().required("Subdomain is required"),
    logo: yup
        .mixed()
        .test("logo-type", "Unsupported file type. Use JPG, PNG, GIF or WebP", (value) => {
            if (value instanceof File) {
                const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
                return allowed.includes(value.type)
            }
            return true
        })
        .test("logo-size", "File too large (max 3MB)", (value) => {
            if (value instanceof File) {
                return value.size <= 3 * 1024 * 1024
            }
            return true
        }).nullable().optional(),
})
