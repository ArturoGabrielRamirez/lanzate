"use client"

import { usePathname } from "next/navigation"

import { PageHeader } from "@/features/global/components/page-header/page-header"
import type { BreadcrumbEntry } from "@/features/global/types/page-header.types"
import { STORE_SEGMENT_CONFIG } from "@/features/stores/constants/store-page-header.constants"

interface StorePageHeaderProps {
  subdomain: string
}

export function StorePageHeader({ subdomain }: StorePageHeaderProps) {
  const pathname = usePathname()

  const storeBase = pathname.split(`/stores/${subdomain}`)[0] + `/stores/${subdomain}`
  const storesListHref = pathname.split(`/stores/${subdomain}`)[0] + "/stores"
  const afterBase = pathname.split(`/stores/${subdomain}`)[1] ?? ""
  const segment = afterBase.replace(/^\//, "").split("/")[0] ?? ""

  const config = STORE_SEGMENT_CONFIG[segment] ?? {
    title: segment.charAt(0).toUpperCase() + segment.slice(1),
    label: segment,
  }

  const breadcrumbs: BreadcrumbEntry[] =
    segment === ""
      ? [{ label: "Mis tiendas", href: storesListHref }, { label: subdomain }]
      : [
          { label: "Mis tiendas", href: storesListHref },
          { label: subdomain, href: storeBase },
          { label: config.label },
        ]

  return <PageHeader title={config.title} breadcrumbs={breadcrumbs} />
}
