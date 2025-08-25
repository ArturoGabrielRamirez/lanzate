import * as yup from "yup"

export const editContactSchema = yup.object({
    contact_phone: yup.string().required("Phone number is required").max(15, "Phone number must be less than 15 characters long").matches(/^\d+$/, "Phone number must contain only numbers"),
    contact_email: yup.string().email("Invalid email format").required("Email is required").max(255, "Email must be less than 255 characters long")
})

export type EditContactData = yup.InferType<typeof editContactSchema>
