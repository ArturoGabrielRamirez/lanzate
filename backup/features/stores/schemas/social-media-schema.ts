import * as yup from "yup"

export const editSocialMediaSchema = yup.object({
    facebook_url: yup.string().url("Formato de URL de Facebook inválido").optional(),
    instagram_url: yup.string().url("Formato de URL de Instagram inválido").optional(),
    x_url: yup.string().url("Formato de URL de X (Twitter) inválido").optional()
})

