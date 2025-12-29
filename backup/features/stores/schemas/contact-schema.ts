import * as yup from "yup"

export const editContactSchema = yup.object({
    contact_phone: yup.string().max(15, "El número de teléfono debe tener menos de 15 caracteres").matches(/^[0-9]+$/, "El número de teléfono solo puede contener números"),
    contact_email: yup.string().email("Formato de correo electrónico inválido").max(255, "El correo electrónico debe tener menos de 255 caracteres")
})

