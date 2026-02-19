import Link from "next/link"
import * as React from "react"

import { Title } from "@/features/global/components/typography/title/title"
import type { PageHeaderProps } from "@/features/global/types/page-header.types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/features/shadcn/components/ui/breadcrumb"

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <Title size="md">{title}</Title>
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {!crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}
