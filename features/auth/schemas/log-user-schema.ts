import * as yup from 'yup'

import { passwordSchema, emailSchema } from '@/features/auth/schemas'

export const loginFormSchema = yup.object({
  password: passwordSchema,
  email: emailSchema,
})

export const joinWaitlistSchema = yup.object({
  email: emailSchema,
})