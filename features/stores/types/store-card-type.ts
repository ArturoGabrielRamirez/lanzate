import { Store } from "@prisma/client"

export type Props = {
    store: Store & { _count: { products: number } }
}