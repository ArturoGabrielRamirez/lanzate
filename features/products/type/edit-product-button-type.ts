import { Product, Category } from "@/prisma/generated/prisma"

export type Props = {
    product: Product & { categories: Category[] }
    slug: string
    onComplete?: () => void
    userId: number
}