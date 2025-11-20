import * as Yup from "yup"

export const changeEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Must be a valid email")
        .required("Email is required")
});

export const changeEmailButtonSchema = Yup.object().shape({
    email: Yup.string()
        .email("Must be a valid email")
        .required("Email is required"),
    currentPassword: Yup.string()
        .required("Current password is required")
});