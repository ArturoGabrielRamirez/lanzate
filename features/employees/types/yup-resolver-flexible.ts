import { yupResolver } from "@hookform/resolvers/yup"
import type { AnyObjectSchema } from "yup"
import type { Resolver } from "react-hook-form"
import { InferFormValues } from "./yup-types"

export const yupResolverFlexible = <T extends AnyObjectSchema>(schema: T): Resolver<InferFormValues<T>> => {
    return yupResolver(schema as unknown as AnyObjectSchema) as Resolver<InferFormValues<T>>
}
