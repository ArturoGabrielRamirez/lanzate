import * as yup from "yup"

export const editSocialMediaSchema = yup.object({
    facebook_url: yup.string().url("Invalid Facebook URL format").optional(),
    instagram_url: yup.string().url("Invalid Instagram URL format").optional(),
    x_url: yup.string().url("Invalid X (Twitter) URL format").optional()
})

export type EditSocialMediaData = yup.InferType<typeof editSocialMediaSchema>
