import { Store, StoreOperationalSettings } from "@prisma/client"

export type Props = {
    userId: number
    slug: string
    store: Store & { operational_settings: StoreOperationalSettings | null }
}