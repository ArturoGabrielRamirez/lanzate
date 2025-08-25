import * as yup from "yup"

export const editContactSchema = yup.object({
    contact_phone: yup.string().required("Phone number is required"),
    contact_email: yup.string().email("Invalid email format").required("Email is required")
})

export type EditContactData = yup.InferType<typeof editContactSchema>
