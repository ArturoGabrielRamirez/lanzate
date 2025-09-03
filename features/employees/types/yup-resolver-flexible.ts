import { yupResolver } from "@hookform/resolvers/yup"
import { ObjectSchema } from "yup"
import { Resolver, FieldValues } from "react-hook-form"

export function yupResolverFlexible<P extends FieldValues>(
    schema?: ObjectSchema<P>
): Resolver<P, unknown, P> | undefined {
    if (!schema) return undefined
    return yupResolver(schema) as unknown as Resolver<P, unknown, P>
}
