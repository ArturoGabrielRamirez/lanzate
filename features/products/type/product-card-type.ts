import { Product } from "@/prisma/generated/prisma"

export type Props = {
    product: Product
    slug: string
}