"use client"

import { usePathname } from "next/navigation"

import { PageHeader } from "@/features/global/components/page-header/page-header"
import type { BreadcrumbEntry } from "@/features/global/types/page-header.types"
import { PROFILE_SEGMENT_CONFIG } from "@/features/profile/constants/profile-page-header.constants"

export function ProfilePageHeader() {
  const pathname = usePathname()

  const profileBase = pathname.split("/profile")[0] + "/profile"
  const afterBase = pathname.split("/profile")[1] ?? ""
  const segment = afterBase.replace(/^\//, "").split("/")[0] ?? ""

  const config = PROFILE_SEGMENT_CONFIG[segment] ?? {
    title: segment.charAt(0).toUpperCase() + segment.slice(1),
    label: segment,
  }

  const breadcrumbs: BreadcrumbEntry[] =
    segment === ""
      ? [{ label: "Perfil" }]
      : [{ label: "Perfil", href: profileBase }, { label: config.label }]

  return <PageHeader title={config.title} breadcrumbs={breadcrumbs} />
}
