import { Product } from "@prisma/client"

export type Props = {
    product: Product
    slug: string
}