import type { AnyObjectSchema } from "yup"

export type InferFormValues<T extends AnyObjectSchema> = T extends AnyObjectSchema
  ? ReturnType<T['cast']>
  : never