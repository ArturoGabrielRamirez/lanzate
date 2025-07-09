import { Store } from "@/prisma/generated/prisma"

export type Props = {
    userId: number
    slug: string
    store: Store
}