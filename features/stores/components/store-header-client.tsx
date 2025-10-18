"use client"

import { Store } from "@prisma/client"

import { PageHeader } from "@/features/layout/components"
import { usePathname } from "@/i18n/naviation"

interface StoreHeaderClientProps {
    store: Pick<Store, "id" | "name" | "logo" | "subdomain" | "slug"> & { _count: { products: number } }
}

function StoreHeaderClient({ store }: StoreHeaderClientProps) {

    const pathname = usePathname()// "/stores/lPUEv7i2/account" I only need the last part to dynamically generate the breadcrumbs conditionally. If there's a 
    const lastPart = pathname.split("/") // ["","stores", "lPUEv7i2", "account"]
    console.log("🚀 ~ StoreHeaderClient ~ lastPart:", lastPart)
    const hasLinkAfterSlug = lastPart.length > 3 // true

    const breadcrumbs = [
        { label: store.name, href: `/stores/${store.slug}` },
    ]

    if (hasLinkAfterSlug) {
        breadcrumbs.push({ label: lastPart[lastPart.length - 1], href: pathname })
    }

    return (
        <PageHeader
            title={store.name}
            breadcrumbs={breadcrumbs}
        />
    )
}

export { StoreHeaderClient }