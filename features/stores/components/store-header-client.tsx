"use client"

import { PageHeader } from "@/features/layout/components"
import { StoreCardLogo } from "@/features/stores/components"
import { StoreHeaderClientProps } from "@/features/stores/types"
import { usePathname } from "@/i18n/naviation"

function StoreHeaderClient({ store }: StoreHeaderClientProps) {

    const pathname = usePathname()
    const lastPart = pathname.split("/")
    const hasLinkAfterSlug = lastPart.length > 3

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
            media={<StoreCardLogo logo={store.logo || ""} name={store.name} />}
        />
    )
}

export { StoreHeaderClient }