import { Product, Category } from "@prisma/client"

export type Props = {
    product: Product & { categories: Category[] }
    slug: string
    onComplete?: () => void
    userId: number
}