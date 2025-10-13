import { InferType } from "yup"

import { signUpSchema } from "@/features/auth/schemas"

export type SignupFormPayload = InferType<typeof signUpSchema>