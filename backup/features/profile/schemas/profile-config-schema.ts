import * as yup from 'yup'

export const profileConfigSchema = yup.object().shape({
  first_name: yup.string().nullable().max(50, 'Máximo 50 caracteres'),
  last_name: yup.string().nullable().max(50, 'Máximo 50 caracteres'),
  profile_bio: yup.string().nullable().max(500, 'Máximo 500 caracteres'),
  location: yup.string().nullable().max(100, 'Máximo 100 caracteres'),
  profile_is_public: yup.boolean(),
  show_liked_products: yup.boolean(),
  show_comments: yup.boolean(),
  show_activity: yup.boolean(),
  show_location: yup.boolean(),
})