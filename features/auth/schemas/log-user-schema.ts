import * as yup from 'yup'

import { emailSchema } from '@/features/auth/schemas/email-schema'
import { passwordSchema } from '@/features/auth/schemas/password-schema'

export const loginFormSchema = yup.object({
  password: passwordSchema,
  email: emailSchema,
})

export const joinWaitlistSchema = yup.object({
  email: emailSchema,
})