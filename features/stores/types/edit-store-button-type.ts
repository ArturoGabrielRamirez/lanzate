import { Store } from "@prisma/client"

export type Props = {
    userId: number
    slug: string
    store: Store
}