import { InferType } from "yup"

import { changeEmailSchema } from "@/features/auth/schemas"

export type ChangeEmailFormData = InferType<typeof changeEmailSchema>