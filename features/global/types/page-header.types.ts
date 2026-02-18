import type * as React from "react"

export interface BreadcrumbEntry {
  label: string
  href?: string
}

export interface PageHeaderProps {
  title: string
  breadcrumbs: BreadcrumbEntry[]
  actions?: React.ReactNode
}
