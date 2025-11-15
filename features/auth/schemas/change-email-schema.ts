import * as Yup from "yup"

export const changeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Must be a valid email")
        .required("Email is required")
});